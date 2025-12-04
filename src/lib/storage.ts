import { Categoria, Produto } from "@/types";

const STORAGE_KEYS = {
  PRODUTOS: "supermercado_produtos",
  CATEGORIAS: "supermercado_categorias",
};

// Categorias padrão
const CATEGORIAS_PADRAO: Categoria[] = [
  {
    id: "1",
    nome: "Hortifruti",
    descricao: "Frutas, verduras e legumes frescos",
    cor: "#22C55E",
    icone: "carrot",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "2",
    nome: "Laticínios",
    descricao: "Leite, queijos, iogurtes e derivados",
    cor: "#3B82F6",
    icone: "milk",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "3",
    nome: "Carnes",
    descricao: "Carnes bovinas, suínas, aves e peixes",
    cor: "#EF4444",
    icone: "beef",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "4",
    nome: "Bebidas",
    descricao: "Refrigerantes, sucos, águas e bebidas alcoólicas",
    cor: "#06B6D4",
    icone: "wine",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "5",
    nome: "Padaria",
    descricao: "Pães, bolos e produtos de confeitaria",
    cor: "#F59E0B",
    icone: "cookie",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "6",
    nome: "Limpeza",
    descricao: "Produtos de limpeza doméstica",
    cor: "#8B5CF6",
    icone: "spray-can",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "7",
    nome: "Higiene",
    descricao: "Produtos de higiene pessoal",
    cor: "#EC4899",
    icone: "shirt",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "8",
    nome: "Congelados",
    descricao: "Alimentos congelados e sorvetes",
    cor: "#14B8A6",
    icone: "snowflake",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
];

// Produtos de exemplo
const PRODUTOS_PADRAO: Produto[] = [
  {
    id: "1",
    nome: "Leite Integral",
    descricao: "Leite integral UHT 1L",
    preco: 5.99,
    categoriaId: "2",
    codigo: "7891234567890",
    estoque: 150,
    estoqueMinimo: 20,
    unidade: "un",
    marca: "Italac",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "2",
    nome: "Banana Prata",
    descricao: "Banana prata madura",
    preco: 6.99,
    precoPromocional: 4.99,
    categoriaId: "1",
    codigo: "2000000000001",
    estoque: 80,
    estoqueMinimo: 15,
    unidade: "kg",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "3",
    nome: "Picanha Bovina",
    descricao: "Picanha bovina premium",
    preco: 79.9,
    categoriaId: "3",
    codigo: "2000000000002",
    estoque: 25,
    estoqueMinimo: 10,
    unidade: "kg",
    marca: "Friboi",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "4",
    nome: "Coca-Cola 2L",
    descricao: "Refrigerante Coca-Cola 2 litros",
    preco: 10.99,
    precoPromocional: 8.99,
    categoriaId: "4",
    codigo: "7891234567891",
    estoque: 200,
    estoqueMinimo: 30,
    unidade: "un",
    marca: "Coca-Cola",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "5",
    nome: "Pão Francês",
    descricao: "Pão francês fresquinho",
    preco: 14.9,
    categoriaId: "5",
    codigo: "2000000000003",
    estoque: 5,
    estoqueMinimo: 10,
    unidade: "kg",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "6",
    nome: "Detergente Ypê",
    descricao: "Detergente líquido neutro 500ml",
    preco: 2.49,
    categoriaId: "6",
    codigo: "7891234567892",
    estoque: 300,
    estoqueMinimo: 50,
    unidade: "un",
    marca: "Ypê",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "7",
    nome: "Pizza Congelada",
    descricao: "Pizza de mussarela congelada 460g",
    preco: 18.9,
    precoPromocional: 14.9,
    categoriaId: "8",
    codigo: "7891234567893",
    estoque: 45,
    estoqueMinimo: 15,
    unidade: "un",
    marca: "Sadia",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: "8",
    nome: "Sabonete Dove",
    descricao: "Sabonete Dove original 90g",
    preco: 4.99,
    categoriaId: "7",
    codigo: "7891234567894",
    estoque: 8,
    estoqueMinimo: 20,
    unidade: "un",
    marca: "Dove",
    ativo: false,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
];

function parseDate(obj: Record<string, unknown>): Record<string, unknown> {
  const result = { ...obj };
  if (result.criadoEm) result.criadoEm = new Date(result.criadoEm as string);
  if (result.atualizadoEm) result.atualizadoEm = new Date(result.atualizadoEm as string);
  return result;
}

export const storage = {
  // Categorias
  getCategorias(): Categoria[] {
    if (typeof window === "undefined") return CATEGORIAS_PADRAO;
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
    if (!data) {
      this.setCategorias(CATEGORIAS_PADRAO);
      return CATEGORIAS_PADRAO;
    }
    return JSON.parse(data).map(parseDate) as Categoria[];
  },

  setCategorias(categorias: Categoria[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
  },

  addCategoria(categoria: Omit<Categoria, "id" | "criadoEm" | "atualizadoEm">): Categoria {
    const categorias = this.getCategorias();
    const novaCategoria: Categoria = {
      ...categoria,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    categorias.push(novaCategoria);
    this.setCategorias(categorias);
    return novaCategoria;
  },

  updateCategoria(id: string, data: Partial<Categoria>): Categoria | null {
    const categorias = this.getCategorias();
    const index = categorias.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categorias[index] = { ...categorias[index], ...data, atualizadoEm: new Date() };
    this.setCategorias(categorias);
    return categorias[index];
  },

  deleteCategoria(id: string): boolean {
    const categorias = this.getCategorias();
    const filtered = categorias.filter((c) => c.id !== id);
    if (filtered.length === categorias.length) return false;
    this.setCategorias(filtered);
    return true;
  },

  // Produtos
  getProdutos(): Produto[] {
    if (typeof window === "undefined") return PRODUTOS_PADRAO;
    const data = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
    if (!data) {
      this.setProdutos(PRODUTOS_PADRAO);
      return PRODUTOS_PADRAO;
    }
    return JSON.parse(data).map(parseDate) as Produto[];
  },

  setProdutos(produtos: Produto[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
  },

  addProduto(produto: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">): Produto {
    const produtos = this.getProdutos();
    const novoProduto: Produto = {
      ...produto,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    produtos.push(novoProduto);
    this.setProdutos(produtos);
    return novoProduto;
  },

  updateProduto(id: string, data: Partial<Produto>): Produto | null {
    const produtos = this.getProdutos();
    const index = produtos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    produtos[index] = { ...produtos[index], ...data, atualizadoEm: new Date() };
    this.setProdutos(produtos);
    return produtos[index];
  },

  deleteProduto(id: string): boolean {
    const produtos = this.getProdutos();
    const filtered = produtos.filter((p) => p.id !== id);
    if (filtered.length === produtos.length) return false;
    this.setProdutos(filtered);
    return true;
  },
};

