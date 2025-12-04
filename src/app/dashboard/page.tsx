"use client";

import { useDashboardStats } from "@/hooks/useStore";
import {
  IconPackage,
  IconTag,
  IconAlertTriangle,
  IconDollar,
  IconPercent,
  IconTrendingUp,
  CategoryIcon,
} from "@/components/dashboard/Icons";
import Link from "next/link";

export default function DashboardPage() {
  const { stats, produtos, categorias, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const produtosBaixoEstoque = produtos.filter((p) => p.estoque <= p.estoqueMinimo);
  const produtosRecentes = [...produtos]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Visão geral do seu supermercado</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Produtos"
          value={stats.totalProdutos}
          icon={<IconPackage className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Categorias"
          value={stats.totalCategorias}
          icon={<IconTag className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Produtos Ativos"
          value={stats.produtosAtivos}
          icon={<IconTrendingUp className="w-6 h-6" />}
          color="violet"
        />
        <StatCard
          title="Baixo Estoque"
          value={stats.produtosBaixoEstoque}
          icon={<IconAlertTriangle className="w-6 h-6" />}
          color="amber"
          alert={stats.produtosBaixoEstoque > 0}
        />
        <StatCard
          title="Em Promoção"
          value={stats.produtosEmPromocao}
          icon={<IconPercent className="w-6 h-6" />}
          color="pink"
        />
        <StatCard
          title="Valor Estoque"
          value={`R$ ${stats.valorTotalEstoque.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          icon={<IconDollar className="w-6 h-6" />}
          color="teal"
          isLarge
        />
      </div>

      {/* Grid de conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos com baixo estoque */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <IconAlertTriangle className="w-5 h-5 text-amber-500" />
              Produtos com Baixo Estoque
            </h2>
            <Link
              href="/dashboard/produtos"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Ver todos
            </Link>
          </div>

          {produtosBaixoEstoque.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Nenhum produto com estoque baixo 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {produtosBaixoEstoque.slice(0, 5).map((produto) => {
                const categoria = categorias.find((c) => c.id === produto.categoriaId);
                return (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
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
                        <p className="text-xs text-slate-500">{categoria?.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-semibold">{produto.estoque}</p>
                      <p className="text-xs text-slate-500">Mín: {produto.estoqueMinimo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Produtos Recentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Produtos Recentes</h2>
            <Link
              href="/dashboard/produtos"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {produtosRecentes.map((produto) => {
              const categoria = categorias.find((c) => c.id === produto.categoriaId);
              return (
                <div
                  key={produto.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
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
                      <p className="text-xs text-slate-500">{categoria?.nome}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {produto.precoPromocional ? (
                      <>
                        <p className="text-emerald-400 font-semibold">
                          R$ {produto.precoPromocional.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 line-through">
                          R$ {produto.preco.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-white font-semibold">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Categorias</h2>
          <Link
            href="/dashboard/categorias"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Gerenciar
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categorias.map((categoria) => {
            const produtosCategoria = produtos.filter(
              (p) => p.categoriaId === categoria.id
            ).length;
            return (
              <div
                key={categoria.id}
                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: categoria.cor + "20" }}
                >
                  <CategoryIcon
                    name={categoria.icone}
                    className="w-6 h-6"
                    style={{ color: categoria.cor }}
                  />
                </div>
                <p className="text-sm font-medium text-white text-center">
                  {categoria.nome}
                </p>
                <p className="text-xs text-slate-500">{produtosCategoria} produtos</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "violet" | "amber" | "pink" | "teal";
  alert?: boolean;
  isLarge?: boolean;
}

function StatCard({ title, value, icon, color, alert, isLarge }: StatCardProps) {
  const colorClasses = {
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 shadow-emerald-500/10",
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400 shadow-blue-500/10",
    violet: "from-violet-500/20 to-violet-600/5 text-violet-400 shadow-violet-500/10",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400 shadow-amber-500/10",
    pink: "from-pink-500/20 to-pink-600/5 text-pink-400 shadow-pink-500/10",
    teal: "from-teal-500/20 to-teal-600/5 text-teal-400 shadow-teal-500/10",
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${colorClasses[color]} border border-slate-800 rounded-2xl p-4 shadow-lg overflow-hidden ${
        alert ? "animate-pulse" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className={`mt-1 font-bold text-white ${isLarge ? "text-lg" : "text-2xl"}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800/50 ${colorClasses[color].split(" ")[2]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

