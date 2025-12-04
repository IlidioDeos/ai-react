"use client";

import { useState, useEffect, useCallback } from "react";
import { Produto, Categoria, DashboardStats } from "@/types";
import { storage } from "@/lib/storage";

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutos = useCallback(() => {
    setLoading(true);
    const data = storage.getProdutos();
    setProdutos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const addProduto = useCallback((produto: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">) => {
    const novo = storage.addProduto(produto);
    setProdutos((prev) => [...prev, novo]);
    return novo;
  }, []);

  const updateProduto = useCallback((id: string, data: Partial<Produto>) => {
    const atualizado = storage.updateProduto(id, data);
    if (atualizado) {
      setProdutos((prev) => prev.map((p) => (p.id === id ? atualizado : p)));
    }
    return atualizado;
  }, []);

  const deleteProduto = useCallback((id: string) => {
    const sucesso = storage.deleteProduto(id);
    if (sucesso) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    }
    return sucesso;
  }, []);

  return {
    produtos,
    loading,
    addProduto,
    updateProduto,
    deleteProduto,
    recarregar: carregarProdutos,
  };
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCategorias = useCallback(() => {
    setLoading(true);
    const data = storage.getCategorias();
    setCategorias(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  const addCategoria = useCallback((categoria: Omit<Categoria, "id" | "criadoEm" | "atualizadoEm">) => {
    const nova = storage.addCategoria(categoria);
    setCategorias((prev) => [...prev, nova]);
    return nova;
  }, []);

  const updateCategoria = useCallback((id: string, data: Partial<Categoria>) => {
    const atualizada = storage.updateCategoria(id, data);
    if (atualizada) {
      setCategorias((prev) => prev.map((c) => (c.id === id ? atualizada : c)));
    }
    return atualizada;
  }, []);

  const deleteCategoria = useCallback((id: string) => {
    const sucesso = storage.deleteCategoria(id);
    if (sucesso) {
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    }
    return sucesso;
  }, []);

  return {
    categorias,
    loading,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    recarregar: carregarCategorias,
  };
}

export function useDashboardStats() {
  const { produtos, loading: loadingProdutos } = useProdutos();
  const { categorias, loading: loadingCategorias } = useCategorias();

  const stats: DashboardStats = {
    totalProdutos: produtos.length,
    totalCategorias: categorias.length,
    produtosAtivos: produtos.filter((p) => p.ativo).length,
    produtosBaixoEstoque: produtos.filter((p) => p.estoque <= p.estoqueMinimo).length,
    valorTotalEstoque: produtos.reduce((acc, p) => {
      const preco = p.precoPromocional ?? p.preco;
      return acc + preco * p.estoque;
    }, 0),
    produtosEmPromocao: produtos.filter((p) => p.precoPromocional !== undefined).length,
  };

  return {
    stats,
    produtos,
    categorias,
    loading: loadingProdutos || loadingCategorias,
  };
}

