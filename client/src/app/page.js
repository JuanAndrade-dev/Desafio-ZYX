"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [caminhoes, setCaminhoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({ 
    placa: '', 
    motorista: '', 
    cpf: '', 
    tipo_carga: 'Carga Seca' 
  });

  useEffect(() => {
    carregarCaminhoes();
  }, []);

  const carregarCaminhoes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/caminhoes');
      setCaminhoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  const exportarRelatorio = () => {
    
    const header = ["ID,PLACA,MOTORISTA,CPF,TIPO_CARGA,STATUS,ENTRADA,SAIDA"];
    
    const rows = caminhoes.map(c => {
        const entrada = new Date(c.data_entrada).toLocaleString('pt-BR');
        const saida = c.data_saida ? new Date(c.data_saida).toLocaleString('pt-BR') : '';
  
        return `${c.id},"${c.placa}","${c.motorista}","${c.cpf}","${c.tipo_carga}","${c.status}","${entrada}","${saida}"`;
    });

    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_logistica_zyx.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deletarCaminhao = async (id) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        await axios.delete(`http://localhost:3001/api/caminhoes/${id}`);
        if (editandoId === id) cancelarEdicao();
        carregarCaminhoes();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const prepararEdicao = (caminhao) => {
    setEditandoId(caminhao.id);
    setForm({
      placa: caminhao.placa,
      motorista: caminhao.motorista,
      cpf: caminhao.cpf,
      tipo_carga: caminhao.tipo_carga
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm({ placa: '', motorista: '', cpf: '', tipo_carga: 'Carga Seca' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/caminhoes/${editandoId}`, form);
        alert("Cadastro atualizado com sucesso!");
        cancelarEdicao();
      } else {
        await axios.post('http://localhost:3001/api/caminhoes', form);
        alert("Entrada registrada!");
        setForm({ placa: '', motorista: '', cpf: '', tipo_carga: 'Carga Seca' });
      }
      carregarCaminhoes();
    } catch (error) {
      alert("Erro ao salvar. Verifique os campos.");
    }
  };

  const handlePlacaChange = (e) => {
    let input = e.target.value.toUpperCase();
    const clean = input.replace(/[^A-Z0-9]/g, '');
    let formatted = clean;
    if (clean.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(clean)) {
        formatted = clean.slice(0, 3) + '-' + clean.slice(3);
    }
    if (formatted.length <= 8) setForm({ ...form, placa: formatted });
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setForm({ ...form, cpf: value });
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await axios.patch(`http://localhost:3001/api/caminhoes/${id}/status`, { status: novoStatus });
      carregarCaminhoes();
    } catch (error) {
      console.error("Erro ao atualizar", error);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Aguardando') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (status === 'Em descarga') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status === 'Finalizado') return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800';
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const caminhoesFiltrados = caminhoes.filter(c => 
    c.placa.includes(busca.toUpperCase()) || 
    c.motorista.toLowerCase().includes(busca.toLowerCase())
  );

  const total = caminhoes.length;
  const aguardando = caminhoes.filter(c => c.status === 'Aguardando').length;
  const emDescarga = caminhoes.filter(c => c.status === 'Em descarga').length;
  const finalizados = caminhoes.filter(c => c.status === 'Finalizado').length;

  return (
    <div className="p-8 font-sans min-h-screen bg-gray-50 text-gray-800">
      <div className="mb-8 flex justify-between items-center border-b pb-4">
        <div>
            <h1 className="text-3xl font-bold text-blue-900">🚚 ZYX Logística</h1>
            <p className="text-gray-500">Sistema de Controle de Pátio Inteligente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h4 className="text-gray-500 text-sm font-bold uppercase">Total no Pátio</h4>
            <p className="text-3xl font-bold text-gray-800">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
            <h4 className="text-gray-500 text-sm font-bold uppercase">Aguardando</h4>
            <p className="text-3xl font-bold text-yellow-600">{aguardando}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
            <h4 className="text-gray-500 text-sm font-bold uppercase">Em Descarga</h4>
            <p className="text-3xl font-bold text-blue-600">{emDescarga}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h4 className="text-gray-500 text-sm font-bold uppercase">Finalizados</h4>
            <p className="text-3xl font-bold text-green-600">{finalizados}</p>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg mb-8 shadow-md border ${editandoId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <h3 className="text-xl mb-4 font-semibold text-gray-700 flex items-center gap-2">
            {editandoId ? '✏️ Editando Registro' : 'Registrar Nova Entrada'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-600 mb-1">PLACA DO VEÍCULO</label>
            <input placeholder="" maxLength={8} value={form.placa} onChange={handlePlacaChange} className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full uppercase" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-600 mb-1">CPF DO MOTORISTA</label>
            <input placeholder="000.000.000-00" maxLength={14} value={form.cpf} onChange={handleCpfChange} className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full" />
          </div>
          <div className="flex flex-col md:col-span-1">
            <label className="text-xs font-bold text-gray-600 mb-1">NOME DO MOTORISTA</label>
            <input placeholder="Nome Completo" value={form.motorista} onChange={(e) => setForm({...form, motorista: e.target.value})} className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-600 mb-1">TIPO DE CARGA</label>
            <select value={form.tipo_carga} onChange={(e) => setForm({...form, tipo_carga: e.target.value})} className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full bg-white">
                <option>Carga Seca</option>
                <option>Perecível (Frio)</option>
                <option>Perigosa</option>
                <option>Eletrônicos</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="bg-gray-500 text-white h-[50px] rounded hover:bg-gray-600 font-bold transition shadow px-4">
                    Cancelar
                </button>
            )}
            <button type="submit" className={`text-white h-[50px] rounded font-bold transition shadow-lg w-full ${editandoId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-900 hover:bg-blue-800'}`}>
                {editandoId ? 'SALVAR' : 'REGISTRAR'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-gray-700">Veículos no Pátio</h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
                <input 
                    placeholder="🔍 Buscar..." 
                    value={busca} 
                    onChange={(e) => setBusca(e.target.value)} 
                    className="p-2 border border-gray-300 rounded w-full sm:w-48 focus:outline-none focus:border-blue-500" 
                />
                <button 
                    onClick={exportarRelatorio}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow font-bold text-sm"
                    title="Baixar Tabela em Excel/CSV"
                >
                    Exportar CSV
                </button>
            </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 text-white text-sm uppercase">
            <tr>
              <th className="p-4">Placa / Motorista</th>
              <th className="p-4">Carga</th>
              <th className="p-4">Status</th>
              <th className="p-4">Entrada / Saída</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {caminhoesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                    {busca ? "Nenhum resultado encontrado." : "O pátio está vazio."}
                </td>
              </tr>
            ) : (
              caminhoesFiltrados.map((c) => (
                <tr key={c.id} className={`border-b transition duration-150 ${editandoId === c.id ? 'bg-yellow-50' : 'hover:bg-blue-50'}`}>
                  <td className="p-4">
                    <div className="font-bold text-lg text-gray-800">{c.placa}</div>
                    <div className="text-sm text-gray-600">{c.motorista}</div>
                    <div className="text-xs text-gray-400 font-mono">{c.cpf}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-300">
                        {c.tipo_carga}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={c.status}
                      disabled={editandoId === c.id}
                      onChange={(e) => atualizarStatus(c.id, e.target.value)}
                      className={`py-1 px-3 rounded-full border text-xs font-bold cursor-pointer outline-none uppercase tracking-wide ${getStatusColor(c.status)}`}
                    >
                      <option value="Aguardando">Aguardando</option>
                      <option value="Em descarga">Em descarga</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="text-green-700">Ent: {formatarData(c.data_entrada)}</div>
                    {c.data_saida && <div className="text-red-700 font-bold">Sai: {formatarData(c.data_saida)}</div>}
                  </td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button onClick={() => prepararEdicao(c)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition" title="Editar">✏️</button>
                    <button onClick={() => deletarCaminhao(c.id)} className="text-red-500 hover:bg-red-100 p-2 rounded transition" title="Excluir">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}