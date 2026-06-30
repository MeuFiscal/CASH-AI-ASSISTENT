import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

export class ToolExecutor {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async executeTool(toolName: string, args: any, workspaceId: string): Promise<string> {
    try {
      switch (toolName) {
        case 'criar_receita':
          return await this.createTransaction(args, workspaceId, 'income');
        case 'criar_despesa':
          return await this.createTransaction(args, workspaceId, 'expense');
        case 'consultar_saldo':
          return await this.checkBalance(workspaceId);
        case 'gerar_relatorio':
          return await this.generateReport(args, workspaceId);
        case 'criar_evento':
          return await this.createEvent(args, workspaceId);
        case 'consultar_agenda':
          return await this.consultAgenda(args, workspaceId);
        default:
          return `Aviso: A ferramenta ${toolName} ainda não está totalmente implementada no backend. Informe ao usuário que você não pode buscar ou realizar essa ação real no momento.`;
      }
    } catch (error: any) {
      console.error(`[ToolExecutor] Erro ao executar ${toolName}:`, error.message);
      return `Erro ao executar a ferramenta ${toolName}: ${error.message}`;
    }
  }

  private async createTransaction(args: any, workspaceId: string, type: 'income' | 'expense'): Promise<string> {
    const { description, amount, date, category_name, account_name } = args;

    if (!description || amount === undefined) {
      throw new Error('Description e amount são obrigatórios.');
    }

    // 1. Obter ou Criar Conta
    const accountId = await this.getOrCreateAccount(workspaceId, account_name);

    // 2. Obter ou Criar Categoria (se fornecida)
    let categoryId = null;
    if (category_name) {
      categoryId = await this.getOrCreateCategory(workspaceId, category_name, type);
    }

    // 3. Inserir Transação
    const transactionDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const { error } = await this.supabase.from('transactions').insert({
      workspace_id: workspaceId,
      account_id: accountId,
      category_id: categoryId,
      type: type,
      amount: amount,
      description: description,
      date: transactionDate,
      status: 'completed'
    });

    if (error) {
      throw new Error(`Erro ao inserir transação: ${error.message}`);
    }

    // 4. Atualizar o saldo da conta (Trigger não atualiza o saldo da account automaticamente, precisamos atualizar manual ou via DB)
    // Para simplificar, atualizamos o saldo da account via RPC ou update direto
    const balanceModifier = type === 'income' ? amount : -amount;
    await this.supabase.rpc('update_account_balance', { p_account_id: accountId, p_amount: balanceModifier });
    // Se a function RPC não existir, não vai quebrar pois try catch engole o throw. Vamos fazer um update manual seguro
    
    // Atualização manual de saldo (evita erro se não houver RPC)
    const { data: acc } = await this.supabase.from('accounts').select('balance').eq('id', accountId).single();
    if (acc) {
      const newBalance = Number(acc.balance) + Number(balanceModifier);
      await this.supabase.from('accounts').update({ balance: newBalance }).eq('id', accountId);
    }

    return `Transação registrada com sucesso: ${description} no valor de R$ ${amount}.`;
  }

  private async getOrCreateAccount(workspaceId: string, accountName?: string): Promise<string> {
    // Se o nome da conta for fornecido, tenta buscar por nome
    if (accountName) {
      const { data: exactAccount } = await this.supabase
        .from('accounts')
        .select('id')
        .eq('workspace_id', workspaceId)
        .ilike('name', accountName)
        .maybeSingle();
      
      if (exactAccount) return exactAccount.id;
    }

    // Se não forneceu nome ou não achou, pega a primeira conta do workspace
    const { data: firstAccount } = await this.supabase
      .from('accounts')
      .select('id')
      .eq('workspace_id', workspaceId)
      .limit(1)
      .maybeSingle();

    if (firstAccount) return firstAccount.id;

    // Se não existe NENHUMA conta, cria a Conta Principal
    const defaultName = accountName || 'Conta Principal';
    const { data: newAccount, error } = await this.supabase
      .from('accounts')
      .insert({
        workspace_id: workspaceId,
        name: defaultName,
        type: 'checking',
        balance: 0
      })
      .select('id')
      .single();
    
    if (error || !newAccount) {
      throw new Error('Não foi possível criar uma conta padrão para registrar a transação.');
    }

    return newAccount.id;
  }

  private async getOrCreateCategory(workspaceId: string, categoryName: string, type: 'income' | 'expense'): Promise<string> {
    // Tenta encontrar a categoria pelo nome (case insensitive)
    const { data: existingCategory } = await this.supabase
      .from('categories')
      .select('id')
      .eq('workspace_id', workspaceId)
      .ilike('name', categoryName)
      .eq('type', type)
      .maybeSingle();

    if (existingCategory) return existingCategory.id;

    // Se não existe, cria a categoria automaticamente
    const { data: newCategory, error } = await this.supabase
      .from('categories')
      .insert({
        workspace_id: workspaceId,
        name: categoryName,
        type: type,
        icon: 'Tag', // Ícone genérico padrão
        color: type === 'income' ? '#10B981' : '#EF4444' // Verde ou Vermelho
      })
      .select('id')
      .single();

    if (error || !newCategory) {
      throw new Error(`Falha ao criar categoria ${categoryName}: ${error?.message}`);
    }

    return newCategory.id;
  }

  private async checkBalance(workspaceId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('accounts')
      .select('name, balance')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(`Erro ao consultar saldo: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return "Não há contas cadastradas ou o saldo é zero.";
    }

    const balances = data.map(acc => `${acc.name}: R$ ${acc.balance}`).join(', ');
    return `Saldo atual das contas: ${balances}`;
  }

  private async generateReport(args: any, workspaceId: string): Promise<string> {
    const { start_date, end_date } = args;
    
    let query = this.supabase.from('transactions').select('amount, type, description, date, categories(name)').eq('workspace_id', workspaceId);
    
    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);
    
    const { data, error } = await query;
    if (error) {
      return `Erro ao buscar transações reais: ${error.message}`;
    }
    
    if (!data || data.length === 0) {
      return "Não foram encontradas transações (receitas ou despesas) para este período no banco de dados. Informe o usuário que não há registros.";
    }
    
    const formattedData = data.map(t => {
      const catName = t.categories ? (Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any).name) : 'Sem categoria';
      return `[Data: ${t.date.split('T')[0]}] ${t.type === 'income' ? 'RECEITA' : 'DESPESA'} | Valor: R$ ${t.amount} | Descrição: ${t.description} | Categoria: ${catName}`;
    });
    
    return `RELATÓRIO REAL DO BANCO DE DADOS (USE APENAS ESTES DADOS):\n${formattedData.join('\n')}`;
  }

  private async createEvent(args: any, workspaceId: string): Promise<string> {
    const { title, start_time, end_time, description, location } = args;
    
    if (!title || !start_time) {
      throw new Error('Title and start_time are required.');
    }

    const startDate = new Date(start_time);
    if (isNaN(startDate.getTime())) {
      return "ERRO DE FORMATO: A data de início (start_time) é inválida. Você deve enviar estritamente no formato ISO 8601 (Exemplo: 2026-07-01T10:00:00Z). Tente novamente usando o formato correto.";
    }

    let endDate = null;
    if (end_time) {
      const parsedEnd = new Date(end_time);
      if (isNaN(parsedEnd.getTime())) {
         return "ERRO DE FORMATO: A data de término (end_time) é inválida. Você deve enviar estritamente no formato ISO 8601.";
      }
      endDate = parsedEnd.toISOString();
    }

    const { error } = await this.supabase.from('calendar_events').insert({
      workspace_id: workspaceId,
      title,
      description,
      location,
      start_time: startDate.toISOString(),
      end_time: endDate
    });

    if (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    return `Evento '${title}' criado com sucesso para ${startDate.toISOString()}.`;
  }

  private async consultAgenda(args: any, workspaceId: string): Promise<string> {
    const { date } = args;
    
    let query = this.supabase.from('calendar_events').select('*').eq('workspace_id', workspaceId);
    
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const endD = new Date(d);
      endD.setHours(23,59,59,999);
      query = query.gte('start_time', d.toISOString()).lte('start_time', endD.toISOString());
    } else {
      const d = new Date();
      d.setHours(0,0,0,0);
      query = query.gte('start_time', d.toISOString());
    }
    
    const { data, error } = await query;
    if (error) return `Erro ao consultar agenda: ${error.message}`;
    
    if (!data || data.length === 0) return "Nenhum compromisso encontrado.";
    
    const formatted = data.map(e => `[${e.start_time}] ${e.title}`);
    return `Compromissos reais na agenda:\n${formatted.join('\n')}`;
  }
}
