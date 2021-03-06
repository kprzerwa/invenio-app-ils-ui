import React, { Component } from 'react';
import { Button, Header, Icon, Message, Step } from 'semantic-ui-react';
import { STEPS } from '../../DocumentRequestSteps';
import PropTypes from 'prop-types';

export const ReviewStep = ({ step }) => (
  <Step active={step === STEPS.review} disabled={step !== STEPS.review}>
    <Icon name="check" />
    <Step.Content>
      <Step.Title>Review</Step.Title>
      <Step.Description>Review before you finalize your order</Step.Description>
    </Step.Content>
  </Step>
);

ReviewStep.propTypes = {
  step: PropTypes.string.isRequired,
};

export default class ReviewStepContent extends Component {
  onAcceptClick = () => {
    const { acceptRequest, data } = this.props;
    acceptRequest(data.pid);
  };

  render() {
    const {
      step,
      data: { metadata },
    } = this.props;
    return step === STEPS.review ? (
      metadata.state !== 'ACCEPTED' ? (
        <>
          <Message info>
            <Message.Header>
              Review and accept your book request!
            </Message.Header>
            <p>Notice that you will not be able to make any further changes.</p>
          </Message>
          <Header textAlign="center">
            <Button size="large" primary onClick={this.onAcceptClick}>
              Accept
            </Button>
          </Header>
        </>
      ) : (
        <Message success>
          <Message.Header>
            Your order has been successfully created!
          </Message.Header>
        </Message>
      )
    ) : null;
  }
}

ReviewStepContent.propTypes = {
  acceptRequest: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  step: PropTypes.string.isRequired,
};
