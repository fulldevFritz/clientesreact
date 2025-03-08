import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {

  const baseUrl = "https://localhost:5001/api/Clientes";

  const [data, setData] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);

  const [modalEditar, setModalEditar] = useState(false);

  const [modalExcluir, setModalExcluir] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  });

  const selecionarCliente = (cliente, caso) => {
    setClienteSelecionado(cliente);
    (caso === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const [updateData, setUpdateData] = useState(true);

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado,
      [name]: value
    });
    console.log(clienteSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }
  
  const pedidoPost = async () => {
    delete clienteSelecionado.id;
    clienteSelecionado.idade = parseInt(clienteSelecionado.idade);
    await axios.post(baseUrl, clienteSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    clienteSelecionado.idade = parseInt(clienteSelecionado.idade);
    await axios.put(baseUrl+"/"+clienteSelecionado.id, clienteSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(cliente => {
          if(cliente.id === resposta.id) {
            cliente.nome = resposta.nome;
            cliente.email = resposta.email;
            cliente.idade = resposta.idade;
          }
          return dadosAuxiliar;
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
    }

    const pedidoDelete = async () => {
      await axios.delete(baseUrl+"/"+clienteSelecionado.id)
        .then(response => {
          setData(data.filter(cliente => cliente.id !== response.data));
          setUpdateData(true);
          abrirFecharModalExcluir();
        }).catch(error => {
          console.log(error);
        }
      )
    }

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])
  

  return (
    <div className="cliente-container">
      <br />
      <h3>Cadastro de Clientes</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success"  onClick={()=>abrirFecharModalIncluir()} >Incluir Novo Cliente</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          { data.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.idade}</td>
              <td>
                <button className="btn btn-primary" onClick={()=> selecionarCliente(cliente, "Editar")} >Editar</button> {" "}
                <button className="btn btn-danger" onClick={()=> selecionarCliente(cliente, "Excluir")}>Excluir</button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>
      
      <Modal isOpen={modalIncluir}>
        <ModalHeader>
          <div>
            <h3>Novo Cliente</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange}/>
            <br />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>pedidoPost()} >Salvar</button> {" "}
          <button className="btn btn-danger" onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>
          <div>
            <h3>Editar Cliente</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label><br /> 
            <input type="text" className="form-control" 
            readOnly value={clienteSelecionado && clienteSelecionado.id}/><br />
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
            value={clienteSelecionado && clienteSelecionado.nome} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
            value={clienteSelecionado && clienteSelecionado.email} />
            <br />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} 
            value={clienteSelecionado && clienteSelecionado.idade} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>pedidoPut()} >Salvar</button> {" "}
          <button className="btn btn-danger" onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão do cliente : {clienteSelecionado && clienteSelecionado.nome} ?
        </ModalBody>
        
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>pedidoDelete()} >Sim</button> {" "}
          <button className="btn btn-secondary" onClick={()=>abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
