import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPrediction } from 'app/shared/model/prediction.model';
import { getEntities } from './prediction.reducer';
import {  Pagination,Form,FormControl } from 'react-bootstrap';


export const Prediction = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const predictionList = useAppSelector(state => state.prediction.entities);
  const loading = useAppSelector(state => state.prediction.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredPredictionList = predictionList
    .filter((prediction) =>
    prediction.energie.nomSystemEnergitique.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //console.log('predictionList', JSON.stringify(predictionList));

  return (
    <div>
      <h2 id="prediction-heading" data-cy="PredictionHeading">
        Predictions
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn-light custom-button-refresh" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          {/* <Link to="/prediction/new" className="btn btn-light jh-create-entity custom-button-new" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;  new Prediction
          </Link> */}
        </div>
      </h2>

      <div className="table-responsive">
      <Form >
        <FormControl
          type="text"
          placeholder="Search Energy System..."
          className="mr-sm-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form>
      <br></br>
      {filteredPredictionList && filteredPredictionList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                
                <th>Start Date</th>
                <th>End Date</th>
                <th>Predicted Consumption</th>
                <th>Precision</th>
                <th>Local Number</th>
                <th>Building</th>
                <th>Energy System</th>
                <th>Action</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredPredictionList.map((prediction, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  {/* <td>
                    <Button tag={Link} to={`/prediction/${prediction.id}`} color="link" size="sm">
                      {prediction.id}
                    </Button>
                  </td> */}
                  <td>
                    {prediction.dateDebut ? <TextFormat type="date" value={prediction.dateDebut} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {prediction.dateFin ? <TextFormat type="date" value={prediction.dateFin} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{prediction.consommationPredit}</td>
                  <td>{prediction.precision}</td>
                  <td>N°{prediction.locale ? prediction.locale.numero : ''}</td>
                  <td>{prediction.locale ? prediction.locale.batiment.batimentNom: ''}</td>
                  <td>{prediction.energie ? prediction.energie.nomSystemEnergitique : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      {/* <Button tag={Link} to={`/prediction/${prediction.id}`} className="custom-button-view" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/prediction/${prediction.id}/edit`} className="custom-button-edit" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button> */}
                      <Button tag={Link} to={`/prediction/${prediction.id}/delete`} className="custom-button-delete" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Predictions found</div>
        )}
        <Pagination>
          {Array.from({ length: Math.ceil(predictionList.length / itemsPerPage) }).map(
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
    </div>
  );
};

export default Prediction;
