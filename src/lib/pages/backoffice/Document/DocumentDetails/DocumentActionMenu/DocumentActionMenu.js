import { patronApi } from '@api';
import { ESSelectorLoanRequest } from '@modules/ESSelector';
import { serializePatron } from '@modules/ESSelector/serializer';
import { EditButton, NewButton } from '@components/backoffice/buttons';
import { LoanIcon } from '@components/backoffice/icons';
import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@components/backoffice/buttons/ScrollingMenu';
import { DocumentDeleteModal } from '../DocumentDeleteModal';
import { BackOfficeRoutes } from '@routes/urls';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';

export default class DocumentActionMenu extends Component {
  requestLoanButton = (
    <div>
      {/* THIS DIV MUST be here, without it the trigger does not work */}
      <Button positive icon labelPosition="left" size="small" fluid>
        <LoanIcon />
        Request loan for a patron
      </Button>
    </div>
  );

  requestLoan = (
    patronPid,
    { requestEndDate = null, deliveryMethod = null } = {}
  ) => {
    const {
      document: {
        metadata: { pid: documentPid },
      },
      requestLoanForPatron,
    } = this.props;
    const optionalParams = {};
    if (!isEmpty(requestEndDate)) {
      optionalParams.requestEndDate = requestEndDate;
    }
    if (!isEmpty(deliveryMethod)) {
      optionalParams.deliveryMethod = deliveryMethod;
    }
    requestLoanForPatron(documentPid, patronPid, optionalParams);
  };

  render() {
    const { document, relations, offset } = this.props;
    return (
      <div className="bo-action-menu">
        <EditButton
          fluid
          to={BackOfficeRoutes.documentEditFor(document.metadata.pid)}
          text="Edit document"
        />
        <DocumentDeleteModal relations={relations} document={document} />
        <Divider horizontal>Create</Divider>
        <NewButton
          text="New physical copy"
          fluid
          to={{
            pathname: BackOfficeRoutes.itemCreate,
            state: { document },
          }}
        />
        <NewButton
          text="New E-item"
          fluid
          to={{
            pathname: BackOfficeRoutes.eitemCreate,
            state: { document },
          }}
        />
        <ESSelectorLoanRequest
          trigger={this.requestLoanButton}
          query={patronApi.list}
          serializer={serializePatron}
          title={`Request a loan for document ${document.pid} on behalf of patron`}
          content="Search for the patron to whom the loan should be assigned"
          selectionInfoText="The loan will be assigned to the following patron"
          emptySelectionInfoText="No patrons selected yet"
          onSave={this.requestLoan}
          saveButtonContent="Perform request"
        />
        <Divider horizontal>Navigation</Divider>
        <ScrollingMenu offset={offset}>
          <ScrollingMenuItem elementId="metadata" label="Metadata" />
          <ScrollingMenuItem elementId="loan-requests" label="Loan requests" />
          <ScrollingMenuItem
            elementId="document-items"
            label="Physical items"
          />
          <ScrollingMenuItem
            elementId="document-eitems"
            label="Electronic items"
          />
          <ScrollingMenuItem
            elementId="document-series"
            label="Part of series"
          />
          <ScrollingMenuItem elementId="document-siblings" label="Relations" />
          <ScrollingMenuItem
            elementId="document-statistics"
            label="Statistics"
          />
        </ScrollingMenu>
      </div>
    );
  }
}

DocumentActionMenu.propTypes = {
  relations: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  requestLoanForPatron: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};