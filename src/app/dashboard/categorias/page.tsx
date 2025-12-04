"use client";

import { useState } from "react";
import { useCategorias, useProdutos } from "@/hooks/useStore";
import { Categoria } from "@/types";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  CategoryIcon,
} from "@/components/dashboard/Icons";
import { ConfirmModal } from "@/components/dashboard/Modal";
import { CategoriaForm } from "@/components/dashboard/CategoriaForm";

export default function CategoriasPage() {
  const { categorias, loading, deleteCategoria } = useCategorias();
  const { produtos } = useProdutos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [categoriaDeletando, setCategoriaDeletando] = useState<Categoria | null>(null);

  const handleEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setIsFormOpen(true);
  };

  const handleDeletar = () => {
    if (categoriaDeletando) {
      deleteCategoria(categoriaDeletando.id);
      setCategoriaDeletando(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCategoriaEditando(null);
  };

  const getProdutosCategoria = (categoriaId: string) => {
    return produtos.filter((p) => p.categoriaId === categoriaId).length;
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
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-slate-400">Organize seus produtos em categorias</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <IconPlus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {/* Grid de Categorias */}
      {categorias.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CategoryIcon name="package" className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Nenhuma categoria cadastrada
          </h3>
          <p className="text-slate-400 mb-6">
            Comece criando sua primeira categoria para organizar os produtos.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
          >
            <IconPlus className="w-5 h-5" />
            Criar Categoria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categorias.map((categoria) => {
            const totalProdutos = getProdutosCategoria(categoria.id);
            return (
              <div
                key={categoria.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: categoria.cor + "20" }}
                  >
                    <CategoryIcon
                      name={categoria.icone}
                      className="w-7 h-7"
                      style={{ color: categoria.cor }}
                    />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditar(categoria)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Editar"
                    >
                      <IconPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoriaDeletando(categoria)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Excluir"
                      disabled={totalProdutos > 0}
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">
                  {categoria.nome}
                </h3>
                {categoria.descricao && (
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {categoria.descricao}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-sm text-slate-500">
                    {totalProdutos} produto{totalProdutos !== 1 ? "s" : ""}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoria.cor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de formulário */}
      <CategoriaForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        categoria={categoriaEditando}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!categoriaDeletando}
        onClose={() => setCategoriaDeletando(null)}
        onConfirm={handleDeletar}
        title="Excluir Categoria"
        message={
          getProdutosCategoria(categoriaDeletando?.id || "") > 0
            ? `Não é possível excluir "${categoriaDeletando?.nome}" pois existem produtos vinculados a ela.`
            : `Tem certeza que deseja excluir "${categoriaDeletando?.nome}"? Esta ação não pode ser desfeita.`
        }
        confirmText={
          getProdutosCategoria(categoriaDeletando?.id || "") > 0 ? "Entendi" : "Excluir"
        }
        variant={
          getProdutosCategoria(categoriaDeletando?.id || "") > 0 ? "warning" : "danger"
        }
      />
    </div>
  );
}

