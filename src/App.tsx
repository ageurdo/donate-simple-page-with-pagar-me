import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { SubmitHandler, FormHandles } from '@unform/core';
import { Scope } from "@unform/core";
import { Form } from "@unform/web";
import Input from "./components/Form/Input";
import Select from "./components/Form/Select";

import "./styles.css";
import axios from 'axios'

const initialData = {
  address: {
    city: 'Foz do Iguaçu',
    state: 'Paraná',
  }
}

interface IBGEUfResponse {
  sigla: string,
}

interface IBGECityResponse {
  nome: string,
}

export default function App() {

  const formRef = useRef<FormHandles>(null);

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUF, setSelectedUF] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      })
  }, [])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const newCities = response.data.map(city => city.nome);
        setCities(newCities);
      }
      )
  }, [selectedUF])

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    console.log(uf, "cliquei")
    setSelectedUF(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city);
  }

  function handleSubmit(data: any) {
    console.log(data);
    if (
      data.user.name === "" ||
      data.user.email === "" ||
      data.user.cpf === "" ||
      data.user.phone === "" ||
      data.address.city === "" ||
      data.address.neighborhood === "" ||
      data.address.number === "" ||
      data.address.street === "" ||
      data.user.uf === "" ||
      data.user.zipcode === "" ||
      data.transaction.amount === "" ||
      data.transaction.card_holder_name === "" ||
      data.transaction.expiration_date_card === "" ||
      data.transaction.number_card === "" ||
      data.transaction.security_code === ""

    ) {
      formRef.current?.setErrors({
        "user.name": "O nome é obrigatório",
        "user.email": "O e-mail é obrigatório",
        "user.cpf": "O CPF é obrigatório",
        "user.phone": "O telefone é obrigatório",
        "address.city": "A cidade é obrigatória",
        "address.neighborhood": "O bairro é obrigatório",
        "address.number": "O número é obrigatório",
        "address.street": "A rua é obrigatória",
        "user.uf": "O estado obrigatório",
        "user.zipcode": "O CEP é obrigatório",
        "transaction.amount": "O valor que deseja enviar é obrigatório",
        "transaction.card_holder_name": "O nome impresso no cartão é obrigatório",
        "transaction.expiration_date_card": "A data de vencimento do cartão é obrigatória",
        "transaction.number_card": "O número do cartão é obrigatório",
        "transaction.security_code": "O código de segurança é obrigatório",
      });
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit} initialData={initialData}>
      <img
        src="https://assembleiadedeusfoz.com.br/wp-content/uploads/elementor/thumbs/Igreja_Assembleia_de_Deus_Foz_do_Iguacu_logo_retina-oo2b8xpqocdmgo9a6p4iv4kv48i2p1zjus5xppevtg.png"
        alt="Assembleia de Deus - Foz do Iguaçu"
      />
      <Scope path="user">

        <Input name="name" label="Nome completo" />
        <Input name="email" label="E-mail" type="email" />

        <div className="two-columns">
          <div>
            <Input name="cpf" label="CPF" />
          </div>
          <div>
            <Input name="phone" label="Telefone" type="tel" />
          </div>
        </div>

      </Scope>

      <h3>Endereço:</h3><br />

      <Scope path="address">
        <div className="two-columns">
          <div>
            <Input name="street" label="Rua" />
            <Input name="neighborhood" label="Bairro" />

            <Select
              label="Estado (UF)"
              placeholder="Selecione uma UF"
              onChange={handleSelectUF}
              name="uf"
              id="uf"
              value={selectedUF}
              array={ufs}
            />

          </div>
          <div>
            <Input name="number" label="Número" />
            <Input name="zipcode" label="CEP" type="numeric" />

            <Select
              label="Cidade"
              placeholder="Selecione uma cidade"
              onChange={handleSelectCity}
              name="city"
              id="city"
              value={selectedCity}
              array={cities}
            />

          </div>
        </div>

      </Scope>

      <h3>Cartão de crédito:</h3><br />
      <Scope path="transaction">
        <div className="two-columns">
          <div>
            <Input name="amount" label="Valor" type="decimal" />
            <Input name="number_card" label="Número do cartão" />
            <Input name="expiration-date_card" label="Data de vencimento" />
          </div>
          <div>
            <label htmlFor="city">Destino</label>
            <select name="destiny">
              <option value="0">Selectione o destino</option>
              <option value="oferta">Oferta</option>
              <option value="dizimo">Dízimo</option>
              <option value="doacao">Doação</option>
              <option value="construcao">Construção</option>
              <option value="missoes">Missões</option>
            </select>

            <Input name="card_holder_name" label="Nome impresso no cartão" />
            <Input name="security_code" label="Código de segurança" type="numeric" />
          </div>
        </div>
        <Input name="country" label="País" />
      </Scope>

      <button type="submit">Enviar</button>

    </Form >
  );
}
