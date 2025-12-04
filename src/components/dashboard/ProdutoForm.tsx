"use client";

import { useState, useEffect } from "react";
import { useProdutos, useCategorias } from "@/hooks/useStore";
import { Produto, UNIDADES_MEDIDA } from "@/types";
import { Modal } from "./Modal";
import { IconChevronDown } from "./Icons";

interface ProdutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: Produto | null;
}

type FormData = {
  nome: string;
  descricao: string;
  preco: string;
  precoPromocional: string;
  categoriaId: string;
  codigo: string;
  estoque: string;
  estoqueMinimo: string;
  unidade: Produto["unidade"];
  marca: string;
  fornecedor: string;
  ativo: boolean;
};

const initialFormData: FormData = {
  nome: "",
  descricao: "",
  preco: "",
  precoPromocional: "",
  categoriaId: "",
  codigo: "",
  estoque: "",
  estoqueMinimo: "",
  unidade: "un",
  marca: "",
  fornecedor: "",
  ativo: true,
};

export function ProdutoForm({ isOpen, onClose, produto }: ProdutoFormProps) {
  const { addProduto, updateProduto } = useProdutos();
  const { categorias } = useCategorias();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!produto;

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco: produto.preco.toString(),
        precoPromocional: produto.precoPromocional?.toString() || "",
        categoriaId: produto.categoriaId,
        codigo: produto.codigo,
        estoque: produto.estoque.toString(),
        estoqueMinimo: produto.estoqueMinimo.toString(),
        unidade: produto.unidade,
        marca: produto.marca || "",
        fornecedor: produto.fornecedor || "",
        ativo: produto.ativo,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [produto, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }

    if (formData.precoPromocional && parseFloat(formData.precoPromocional) >= parseFloat(formData.preco)) {
      newErrors.precoPromocional = "Preço promocional deve ser menor que o preço normal";
    }

    if (!formData.categoriaId) {
      newErrors.categoriaId = "Selecione uma categoria";
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = "Código é obrigatório";
    }

    if (!formData.estoque || parseInt(formData.estoque) < 0) {
      newErrors.estoque = "Estoque não pode ser negativo";
    }

    if (!formData.estoqueMinimo || parseInt(formData.estoqueMinimo) < 0) {
      newErrors.estoqueMinimo = "Estoque mínimo não pode ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data: Omit<Produto, "id" | "criadoEm" | "atualizadoEm"> = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || undefined,
        preco: parseFloat(formData.preco),
        precoPromocional: formData.precoPromocional
          ? parseFloat(formData.precoPromocional)
          : undefined,
        categoriaId: formData.categoriaId,
        codigo: formData.codigo.trim(),
        estoque: parseInt(formData.estoque),
        estoqueMinimo: parseInt(formData.estoqueMinimo),
        unidade: formData.unidade,
        marca: formData.marca.trim() || undefined,
        fornecedor: formData.fornecedor.trim() || undefined,
        ativo: formData.ativo,
      };

      if (isEditing && produto) {
        updateProduto(produto.id, data);
      } else {
        addProduto(data);
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpar erro ao editar
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Produto" : "Novo Produto"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome e Código */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Leite Integral"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.nome ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.nome && (
              <p className="text-xs text-red-400 mt-1">{errors.nome}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Código (SKU/Barras) *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Ex: 7891234567890"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.codigo ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.codigo && (
              <p className="text-xs text-red-400 mt-1">{errors.codigo}</p>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição do produto..."
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
          />
        </div>

        {/* Categoria, Marca e Fornecedor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Categoria *
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className={`w-full appearance-none px-4 py-2.5 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer ${
                errors.categoriaId ? "border-red-500" : "border-slate-700"
              }`}
            >
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3 top-[38px] w-5 h-5 text-slate-500 pointer-events-none" />
            {errors.categoriaId && (
              <p className="text-xs text-red-400 mt-1">{errors.categoriaId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ex: Italac"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Fornecedor
            </label>
            <input
              type="text"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              placeholder="Ex: Distribuidora XYZ"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Preços */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Preço (R$) *
            </label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.preco ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.preco && (
              <p className="text-xs text-red-400 mt-1">{errors.preco}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Preço Promocional (R$)
            </label>
            <input
              type="number"
              name="precoPromocional"
              value={formData.precoPromocional}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.precoPromocional ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.precoPromocional && (
              <p className="text-xs text-red-400 mt-1">{errors.precoPromocional}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Unidade
            </label>
            <select
              name="unidade"
              value={formData.unidade}
              onChange={handleChange}
              className="w-full appearance-none px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
            >
              {UNIDADES_MEDIDA.map((un) => (
                <option key={un.value} value={un.value}>
                  {un.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3 top-[38px] w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Estoque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Estoque Atual *
            </label>
            <input
              type="number"
              name="estoque"
              value={formData.estoque}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.estoque ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.estoque && (
              <p className="text-xs text-red-400 mt-1">{errors.estoque}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Estoque Mínimo *
            </label>
            <input
              type="number"
              name="estoqueMinimo"
              value={formData.estoqueMinimo}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                errors.estoqueMinimo ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.estoqueMinimo && (
              <p className="text-xs text-red-400 mt-1">{errors.estoqueMinimo}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            <span className="ms-3 text-sm font-medium text-slate-300">
              Produto ativo
            </span>
          </label>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : isEditing ? (
              "Atualizar"
            ) : (
              "Cadastrar"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

