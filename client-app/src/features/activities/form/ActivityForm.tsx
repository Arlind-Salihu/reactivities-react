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
import { categoryOptionsActivities } from "../../../app/common/options/CategoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { ActivityFormValues } from "../../../app/models/activity";

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const { createActivity, updateActivity,
    loadActivity, loadingInitial,} = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    emri: Yup.string().required('Fusha per Emrin e activityt është e nevojshme!'),
    kategoria: Yup.string().required('Fusha per Kategorine e activityt është e nevojshme!'),
    data: Yup.string().required('Fusha per Datën e activityt është e nevojshme!').nullable(),
    brendi: Yup.string().required(),
    pershkrimi: Yup.string().required()
  })

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading Activity..."/>

  return (
    <Segment clearing>
      <Header content={"Activity Form"} sub color='teal'/>
      <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name='emri' placeholder='Name'/>
            <MySelectInput options={categoryOptionsActivities} placeholder="Location" name="kategoria"/>
            <MyTextInput placeholder="Section" name="brendi"/>
            <MyDateInput  placeholderText="Date" name="data" showTimeSelect timeCaption='time' dateFormat='d MMMM, yyyy h:mm aa'/>
            <MyTextArea rows={3} placeholder="Descripiton" name="pershkrimi"/>
            <Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} floated="right" positive type="submit" content="Submit"/>
            <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
