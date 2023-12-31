import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './batiment.reducer';

export const BatimentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const batimentEntity = useAppSelector(state => state.batiment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="batimentDetailsHeading">Batiment</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{batimentEntity.id}</dd>
          <dt>
            <span id="adresse">Adresse</span>
          </dt>
          <dd>{batimentEntity.adresse}</dd>
          <dt>
            <span id="batimentNom">Batiment Nom</span>
          </dt>
          <dd>{batimentEntity.batimentNom}</dd>
          <dt>
            <span id="nbrEtage">Number of floors</span>
          </dt>
          <dd>{batimentEntity.nbrEtage}</dd>
        </dl>
        <Button tag={Link} to="/batiment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/batiment/${batimentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default BatimentDetail;
