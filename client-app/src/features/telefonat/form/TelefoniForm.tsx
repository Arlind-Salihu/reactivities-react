import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Segment, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptionsTelefonat } from "../../../app/common/options/CategoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Telefoni } from "../../../app/models/telefoni";

export default observer(function TelefoniForm() {
  const history = useHistory();
  const { telefoniStore } = useStore();
  const { createTelefoni, updateTelefoni,
    loading, loadTelefoni, loadingInitial,} = telefoniStore;
  const { id } = useParams<{ id: string }>();

  const [telefoni, setTelefoni] = useState<Telefoni>({
    id: '',
    emri: '',
    kategoria: '',
    brendi: '',
    data: null,
    pershkrimi: '',
    cmimi: null
  });

  const validationSchema = Yup.object({
    emri: Yup.string().required('Fusha per Emrin e telefonit është e nevojshme!'),
    kategoria: Yup.string().required('Fusha per Kategorine e telefonit është e nevojshme!'),
    data: Yup.string().required('Fusha per Datën e telefonit është e nevojshme!').nullable(),
    brendi: Yup.string().required(),
    pershkrimi: Yup.string().required(),
    cmimi: Yup.number().required()
  })

  useEffect(() => {
    if (id) loadTelefoni(id).then(telefoni => setTelefoni(telefoni!));
  }, [id, loadTelefoni]);

  function handleFormSubmit(telefoni: Telefoni) {
    if (telefoni.id.length === 0) {
      let newTelefoni = {
        ...telefoni,
        id: uuid(),
      };
      createTelefoni(newTelefoni).then(() =>
        history.push(`/telefonat/${newTelefoni.id}`)
      );
    } else {
      updateTelefoni(telefoni).then(() =>
        history.push(`/telefonat/${telefoni.id}`)
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Te dhenat e telefonit jane duke u hapur!"/>

  return (
    <Segment clearing>
      <Header content={"Te Dhenat e Telefonit"} sub color='teal'/>
      <Formik validationSchema={validationSchema} enableReinitialize initialValues={telefoni} onSubmit={values => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name='emri' placeholder='Emri i Telefonit'/>
            <MySelectInput options={categoryOptionsTelefonat} placeholder="Kategoria e Telefonit" name="kategoria"/>
            <MyTextInput placeholder="Brendi i Telefonit" name="brendi"/>
            <MyDateInput  placeholderText="Data" name="data" showTimeSelect timeCaption='time' dateFormat='d MMMM, yyyy h:mm aa'/>
            <MyTextArea rows={3} placeholder="Pershkrimi i Telefonit" name="pershkrimi"/>
            <MyTextInput placeholder="Cmimi i Telefonit" name="cmimi"/>
            <Button disabled={isSubmitting || !dirty || !isValid} loading={loading} floated="right" positive type="submit" content="Submit"/>
            <Button as={Link} to='/telefonat' floated="right" type="button" content="Cancel"/>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
