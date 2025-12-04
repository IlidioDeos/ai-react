export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  icone: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  precoPromocional?: number;
  categoriaId: string;
  codigo: string; // código de barras ou SKU
  estoque: number;
  estoqueMinimo: number;
  unidade: "un" | "kg" | "g" | "l" | "ml" | "cx" | "pct";
  marca?: string;
  fornecedor?: string;
  imagem?: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface DashboardStats {
  totalProdutos: number;
  totalCategorias: number;
  produtosAtivos: number;
  produtosBaixoEstoque: number;
  valorTotalEstoque: number;
  produtosEmPromocao: number;
}

export type UnidadeMedida = Produto["unidade"];

export const UNIDADES_MEDIDA: { value: UnidadeMedida; label: string }[] = [
  { value: "un", label: "Unidade" },
  { value: "kg", label: "Quilograma" },
  { value: "g", label: "Grama" },
  { value: "l", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "cx", label: "Caixa" },
  { value: "pct", label: "Pacote" },
];

export const CORES_CATEGORIA = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#84CC16", // lime
  "#22C55E", // green
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#A855F7", // purple
  "#EC4899", // pink
];

export const ICONES_CATEGORIA = [
  "shopping-cart",
  "package",
  "milk",
  "beef",
  "carrot",
  "apple",
  "cookie",
  "coffee",
  "wine",
  "spray-can",
  "shirt",
  "baby",
  "dog",
  "snowflake",
  "flame",
];

