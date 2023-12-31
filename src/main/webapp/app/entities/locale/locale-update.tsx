import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IEtage } from 'app/shared/model/etage.model';
import { getEntities as getEtages } from 'app/entities/etage/etage.reducer';

import { ILocale } from 'app/shared/model/locale.model';
import { getEntity, updateEntity, createEntity, reset } from './locale.reducer';

export const LocaleUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const batiments = useAppSelector(state =>state.batiment.entities);
  const localeEntity = useAppSelector(state => state.locale.entity);
  const loading = useAppSelector(state => state.locale.loading);
  const updating = useAppSelector(state => state.locale.updating);
  const updateSuccess = useAppSelector(state => state.locale.updateSuccess);
  const [selectedBatiment, setSelectedBatiment] = useState('');
  const [etagesDisponibles, setEtagesDisponibles] = useState([]);

  const handleClose = () => {
    navigate('/locale');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getEtages({}));
  },  [isNew, id, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    const generateEtageOptions = () => {
      const selectedBuilding = batiments.find(
        (it) => it.id.toString() === selectedBatiment.toString()
      );
  
      const options = [];
      for (let i = 0; i < (selectedBuilding ? selectedBuilding.nbrEtage : 0); i++) {
        options.push({
          value: i,
          label: i === 0 ? 'Ground floor' : `Floor ${i}`,
        });
      }
  
      setEtagesDisponibles(options);
    };
  
    generateEtageOptions();
  }, [selectedBatiment, batiments]);

  
  const saveEntity = values => {
    const entity = {
      ...localeEntity,
      ...values,
      batiment: batiments.find(it => it.id.toString() === values.batiment.toString()),



    };

    if (isNew) {
      dispatch(createEntity(entity)).then(response => {
        // eslint-disable-next-line no-console
        console.log(' Local créé :', response);
      });
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...localeEntity,

          batiment: localeEntity?.batiment?.id,


        };







  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="feOptimisationEnergieApp.locale.home.createOrEditLabel" data-cy="LocaleCreateUpdateHeading">
            Create a Local
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="locale-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Number" id="locale-numero" name="numero" data-cy="numero" type="text" />
              <ValidatedField label="Local Type" id="locale-typeLocal" name="typeLocal" data-cy="typeLocal" type="select" >
              <option value=""></option>
                <option value="Appartement">Appartement</option>
                <option value="Office">Office</option>
                <option value="Cabinet">Cabinet</option>
              </ValidatedField>

              <ValidatedField id="locale-batiment" name="batiment" data-cy="batiment" label="Building" type="select" 
              onChange={(event) => {
                  setSelectedBatiment(event.target.value);
                }}>
                <option value=""/>
                {batiments
                  ? batiments.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.batimentNom}
                      </option>
                    ))
                  : null}
              </ValidatedField>


              <ValidatedField
                  label="Floor Number"
                  id="locale-numeroEtage"
                  name="numeroEtage"
                  data-cy="numeroEtage"
                  type="select"
                  value={defaultValues().numeroEtage}
                  onChange={(event) => {
                    // Handle changes if needed
                  }}
                >
                  <option value="" key="0" />
                  {etagesDisponibles.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </ValidatedField>




              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" className="custom-button-save-back" to="/locale" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" className="custom-button-save-back" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LocaleUpdate;
