"use client";

import { useState, useMemo } from "react";
import { useProdutos, useCategorias } from "@/hooks/useStore";
import { Produto, UNIDADES_MEDIDA } from "@/types";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconSearch,
  CategoryIcon,
  IconChevronDown,
} from "@/components/dashboard/Icons";
import { ConfirmModal } from "@/components/dashboard/Modal";
import { ProdutoForm } from "@/components/dashboard/ProdutoForm";

export default function ProdutosPage() {
  const { produtos, loading, deleteProduto } = useProdutos();
  const { categorias } = useCategorias();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [ordenacao, setOrdenacao] = useState<string>("nome");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoDeletando, setProdutoDeletando] = useState<Produto | null>(null);

  const produtosFiltrados = useMemo(() => {
    let resultado = [...produtos];

    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nome.toLowerCase().includes(query) ||
          p.codigo.includes(query) ||
          p.marca?.toLowerCase().includes(query)
      );
    }

    // Filtro de categoria
    if (categoriaFiltro) {
      resultado = resultado.filter((p) => p.categoriaId === categoriaFiltro);
    }

    // Filtro de status
    if (statusFiltro === "ativo") {
      resultado = resultado.filter((p) => p.ativo);
    } else if (statusFiltro === "inativo") {
      resultado = resultado.filter((p) => !p.ativo);
    } else if (statusFiltro === "baixo_estoque") {
      resultado = resultado.filter((p) => p.estoque <= p.estoqueMinimo);
    } else if (statusFiltro === "promocao") {
      resultado = resultado.filter((p) => p.precoPromocional !== undefined);
    }

    // Ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "preco":
          return a.preco - b.preco;
        case "estoque":
          return a.estoque - b.estoque;
        case "recente":
          return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
        default:
          return 0;
      }
    });

    return resultado;
  }, [produtos, searchQuery, categoriaFiltro, statusFiltro, ordenacao]);

  const handleEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setIsFormOpen(true);
  };

  const handleDeletar = () => {
    if (produtoDeletando) {
      deleteProduto(produtoDeletando.id);
      setProdutoDeletando(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProdutoEditando(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-slate-400">Gerencie os produtos do supermercado</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <IconPlus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Categoria */}
          <div className="relative">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
            >
              <option value="">Todas categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="baixo_estoque">Baixo estoque</option>
              <option value="promocao">Em promoção</option>
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>

          {/* Ordenação */}
          <div className="relative">
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
            >
              <option value="nome">Ordenar por nome</option>
              <option value="preco">Ordenar por preço</option>
              <option value="estoque">Ordenar por estoque</option>
              <option value="recente">Mais recentes</option>
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Preço
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => {
                  const categoria = categorias.find((c) => c.id === produto.categoriaId);
                  const unidade = UNIDADES_MEDIDA.find((u) => u.value === produto.unidade);
                  const estoqueBaixo = produto.estoque <= produto.estoqueMinimo;

                  return (
                    <tr
                      key={produto.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: categoria?.cor + "20" }}
                          >
                            <CategoryIcon
                              name={categoria?.icone || "package"}
                              className="w-5 h-5"
                              style={{ color: categoria?.cor }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{produto.nome}</p>
                            <p className="text-xs text-slate-500">
                              {produto.codigo}
                              {produto.marca && ` • ${produto.marca}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            backgroundColor: categoria?.cor + "20",
                            color: categoria?.cor,
                          }}
                        >
                          {categoria?.nome}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {produto.precoPromocional ? (
                          <div>
                            <p className="font-semibold text-emerald-400">
                              R$ {produto.precoPromocional.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500 line-through">
                              R$ {produto.preco.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-medium text-white">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">/{unidade?.label}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`font-semibold ${
                            estoqueBaixo ? "text-amber-400" : "text-white"
                          }`}
                        >
                          {produto.estoque}
                        </p>
                        <p className="text-xs text-slate-500">
                          Mín: {produto.estoqueMinimo}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                            produto.ativo
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditar(produto)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            title="Editar"
                          >
                            <IconPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProdutoDeletando(produto)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Excluir"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer da tabela */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Mostrando {produtosFiltrados.length} de {produtos.length} produtos
          </p>
        </div>
      </div>

      {/* Modal de formulário */}
      <ProdutoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        produto={produtoEditando}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!produtoDeletando}
        onClose={() => setProdutoDeletando(null)}
        onConfirm={handleDeletar}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${produtoDeletando?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  );
}

