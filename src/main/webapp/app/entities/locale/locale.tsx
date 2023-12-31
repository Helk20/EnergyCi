import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Col, Image, Modal, Row } from 'react-bootstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { ILocale } from 'app/shared/model/locale.model';
import { getEntities, getEntity, updateEntity } from './locale.reducer';

import { getEntities as getBoitiersLocalDetail } from 'app/entities/locale-boitier/locale-boitier.reducer';

import { getEntities as getEtages } from 'app/entities/etage/etage.reducer';
import {  Pagination,Form,FormControl } from 'react-bootstrap';

export const Locale = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const localeBoitierList = useAppSelector(state => state.localeBoitier.entities);
  const localeBoitierEntity = useAppSelector(state => state.localeBoitier.loading);

  const localeList = useAppSelector(state => state.locale.entities);
  const loading = useAppSelector(state => state.locale.loading);
  const updating = useAppSelector(state => state.locale.updating);
  const updateSuccess = useAppSelector(state => state.locale.updateSuccess);

  const [selectedLocale, setSelectedLocale] = useState(null);
  const batiments = useAppSelector(state => state.batiment.entities);


  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };
  useEffect(() => {
    dispatch(getBoitiersLocalDetail({}));
  }, []);
  const handleSyncListBoitiersLocalDetail = () => {
    dispatch(getBoitiersLocalDetail({}));
  };
  const { id } = useParams<'id'>();
  const localeEntity = useAppSelector(state => state.locale.entity);
  const [show, setShow] = useState(false);
  const [showview, setShowView] = useState(false);
  const handleClose = () => setShow(false);
  const handleCloseView = () => setShowView(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredLocaleList = localeList
    .filter((locale) =>
    locale.typeLocal.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleShowView = locale => {
    setSelectedLocale(locale);
    setShowView(true);
  };
  const handleSetShow = locale => {
    setSelectedLocale(locale);
    dispatch(getEntity(locale.id)); // Déplacez la logique ici
    setShow(true);
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
    dispatch(getEtages({}));
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...localeEntity,
      ...values,
      batiment: batiments.find(it => it.id.toString() === values.batiment.toString()),

    };

    dispatch(updateEntity(entity));
  };

  const defaultValues = () => localeEntity;
  // console.log("LocalBoitierList: " + JSON.stringify(localeBoitierList null, 2));

  return (
    <div>
      <h2 id="locale-heading" data-cy="LocaleHeading">
        Locals
        <div className="d-flex justify-content-end ">
          <Button className="me-2 btn-light custom-button-refresh" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link
            to="/locale/new"
            className="btn btn-light jh-create-entity custom-button-new"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; new Local
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
      <Form >
        <FormControl
          type="text"
          placeholder="Search Local..."
          className="mr-sm-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form>
      <br></br>
      {filteredLocaleList && filteredLocaleList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Numero</th>
                <th> Local Type</th>
                <th>Building</th>
                <th>Floor Number</th>



                <th style={{ textAlign: 'center' }}> Action</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredLocaleList.map((locale, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{locale.id}</td>
                  <td>{locale.numero}</td>
                  <td>{locale.typeLocal}</td>
                  <td>{locale.batiment ? locale.batiment.batimentNom : ''}</td>
                  <td>{locale.numeroEtage}</td>



                  <td style={{ textAlign: 'center' }}>
                    <div className="btn-group flex-btn-group-container">
                      <Button onClick={() => handleShowView(locale)} size="sm" data-cy="entityDetailsButton" className="custom-button-view">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button onClick={() => handleSetShow(locale)} size="sm" data-cy="entityEditButton" className="custom-button-edit">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/locale/${locale.id}/delete`}
                        size="sm"
                        data-cy="entityDeleteButton"
                        className="custom-button-delete"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Locales found</div>
        )}
        <Pagination>
          {Array.from({ length: Math.ceil(localeList.length / itemsPerPage) }).map(
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
      <Modal show={showview} onHide={handleCloseView}>
        <Modal.Header closeButton>
          <Modal.Title> Boitier Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th>Boitier Reference</th>
                <th>Boitier Type</th>
                <th> Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {localeBoitierList.map((localeBoitier, i) => {
                // Check if a matching boitier was found
                if (selectedLocale && localeBoitier.locale?.id === selectedLocale.id) {
                  return (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      {/* <td>{localeBoitier.locale?.id}</td> */}
                      <td>{localeBoitier.boitier?.boitierReference || ''}</td>
                      <td>{localeBoitier.boitier?.type || ''}</td>
                      <td>{localeBoitier.dateDebut || ''}</td>
                      <td>{localeBoitier.dateFin || ''}</td>
                    </tr>
                  );
                }

                return null; // Return null for non-matching entries
              })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleCloseView}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Local</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center">
            <Col md="8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  <ValidatedField label="Numero" id="locale-numero" name="numero" data-cy="numero" type="text" />
                  <ValidatedField label="Type Local" id="locale-typeLocal" name="typeLocal" data-cy="typeLocal" type="select">
                    <option value=""></option>
                    <option value="Appartement">Appartement</option>
                    <option value="Office">Office</option>
                    <option value="Cabinet">Cabinet</option>
                  </ValidatedField>
                  <ValidatedField id="locale-batiment" name="batiment" data-cy="batiment" label="Building" type="select">
                    <option value=""  />
                    {batiments
                      ? batiments.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.batimentNom}
                          </option>
                        ))
                      : null}
                  </ValidatedField>

                  <ValidatedField label="Floor Number" id="locale-numeroEtage" name="numeroEtage" data-cy="numeroEtage" type="select" >
              <option value=""></option>
              <option value= "0">Ground Floor</option>

                <option value= "1">1</option>
                <option value= "2">2</option>
                <option value= "3">3</option>
                <option value="4">4</option>

              </ValidatedField>
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/locale" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">Back</span>
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Save
                  </Button>
                </ValidatedForm>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Locale;
