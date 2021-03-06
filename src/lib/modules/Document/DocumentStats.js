import { statsApi } from '@api';
import { recordToPidType, withCancel } from '@api/utils';
import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Message, Table } from 'semantic-ui-react';

export class DocumentStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: { count: '-', unique_count: '-' },
      downloads: { count: '-', unique_count: '-' },
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  componentWillUnmount() {
    this.cancellableFetchStats && this.cancellableFetchStats.cancel();
  }

  fetchStats = async () => {
    const { document } = this.props;
    const pidType = recordToPidType(document);
    try {
      this.cancellableFetchStats = withCancel(
        statsApi.recordStats(pidType, document.pid)
      );
      const response = await this.cancellableFetchStats.promise;
      const views = _get(response.data, 'views', {
        count: '-',
        unique_count: '-',
      });
      const downloads = _get(response.data, 'downloads', {
        count: '-',
        unique_count: '-',
      });
      this.setState({ downloads: downloads, views: views });
    } catch (error) {
      // the promise might have been cancelled on Unmount
    }
  };

  render() {
    const { document } = this.props;
    const { downloads, views } = this.state;
    return (
      <Message compact className="document-stats-message">
        <Table compact basic>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Icon name="eye" />
              </Table.Cell>
              <Table.Cell>
                Views <strong>{views.count}</strong>
              </Table.Cell>
              <Table.Cell>
                Unique Views <strong>{views.unique_count}</strong>
              </Table.Cell>
            </Table.Row>

            {document.metadata.eitems.hits && (
              <Table.Row>
                <Table.Cell>
                  <Icon name="download" />
                </Table.Cell>
                <Table.Cell>
                  Downloads <strong>{downloads.count}</strong>
                </Table.Cell>
                <Table.Cell>
                  Unique Downloads <strong>{downloads.unique_count}</strong>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Message>
    );
  }
}

DocumentStats.propTypes = {
  document: PropTypes.object.isRequired,
};
