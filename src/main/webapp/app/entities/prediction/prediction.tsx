import React, { useState, useEffect } from 'react';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './prediction.reducer';
import { Pagination } from 'react-bootstrap';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { Link } from 'react-router-dom';
import { TextFormat } from 'react-jhipster';

export const Prediction = () => {
  const dispatch = useAppDispatch();
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
  const itemsPerPage = 5;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2 id="prediction-heading" data-cy="PredictionHeading">
        Predictions
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn-light custom-button-refresh" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
        </div>
      </h2>

      <div className="table-responsive">
        {predictionList && predictionList.length > 0 ? (
          <div>
            <VictoryChart
              domainPadding={20}
              width={600}
              height={300}
              scale={{ x: 'time' }}
            >
              <VictoryAxis
                tickFormat={(x) => new Date(x).toLocaleDateString()}
                label="Date"
              />
              <VictoryAxis dependentAxis label="Temperature (°C)" />
              <VictoryLine
                data={predictionList.map((prediction) => ({
                  x: new Date(prediction.dateDebut),
                  y: prediction.consommationPredit,
                }))}
              />
            </VictoryChart>

            <Table responsive>
              <thead>
                <tr>
                  <th> Date</th>
                  <th>Predicted Temperature</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {predictionList.slice(indexOfFirstItem, indexOfLastItem).map((prediction, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {prediction.dateDebut ? <TextFormat type="date" value={prediction.dateDebut} format="DD/MM/YYYY" /> : null}
                    </td>
                    <td>{prediction.consommationPredit.toFixed(2)} °C</td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`/prediction/${prediction.id}/delete`} className="custom-button-delete" size="sm" data-cy="entityDeleteButton">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

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
        ) : (
          !loading && <div className="alert alert-warning">No Predictions found</div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
