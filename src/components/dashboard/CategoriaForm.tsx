"use client";

import { useState, useEffect } from "react";
import { useCategorias } from "@/hooks/useStore";
import { Categoria, CORES_CATEGORIA, ICONES_CATEGORIA } from "@/types";
import { Modal } from "./Modal";
import { CategoryIcon, IconCheck } from "./Icons";

interface CategoriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: Categoria | null;
}

type FormData = {
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
};

const initialFormData: FormData = {
  nome: "",
  descricao: "",
  cor: CORES_CATEGORIA[0],
  icone: ICONES_CATEGORIA[0],
};

export function CategoriaForm({ isOpen, onClose, categoria }: CategoriaFormProps) {
  const { addCategoria, updateCategoria } = useCategorias();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!categoria;

  useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao || "",
        cor: categoria.cor,
        icone: categoria.icone,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [categoria, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || undefined,
        cor: formData.cor,
        icone: formData.icone,
      };

      if (isEditing && categoria) {
        updateCategoria(categoria.id, data);
      } else {
        addCategoria(data);
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Categoria" : "Nova Categoria"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <div className="flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: formData.cor + "20" }}
          >
            <CategoryIcon
              name={formData.icone}
              className="w-10 h-10"
              style={{ color: formData.cor }}
            />
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Nome da Categoria *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Hortifruti"
            className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
              errors.nome ? "border-red-500" : "border-slate-700"
            }`}
          />
          {errors.nome && (
            <p className="text-xs text-red-400 mt-1">{errors.nome}</p>
          )}
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
            placeholder="Descrição da categoria..."
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
          />
        </div>

        {/* Cor */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Cor
          </label>
          <div className="flex flex-wrap gap-2">
            {CORES_CATEGORIA.map((cor) => (
              <button
                key={cor}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, cor }))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  formData.cor === cor
                    ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: cor }}
              >
                {formData.cor === cor && (
                  <IconCheck className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ícone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {ICONES_CATEGORIA.map((icone) => (
              <button
                key={icone}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, icone }))}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  formData.icone === icone
                    ? "bg-emerald-500/20 ring-2 ring-emerald-500"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <CategoryIcon
                  name={icone}
                  className="w-5 h-5"
                  style={{ color: formData.icone === icone ? formData.cor : "#94a3b8" }}
                />
              </button>
            ))}
          </div>
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

