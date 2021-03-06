import { LiteratureCover } from '@modules/Literature';
import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { SeriesAuthors } from '@modules/Series';
import { SeriesAccess, SeriesTitle } from '@modules/Series';
import { ShowMoreContent } from '@components';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overridable from 'react-overridable';
import { Grid, Responsive } from 'semantic-ui-react';
import { SeriesPanelMobile, SeriesSequences } from './index';

class SeriesPanel extends Component {
  render() {
    const { isLoading, series } = this.props;
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <div
            className="series-panel"
            data-test={series.metadata ? series.metadata.pid : 0}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}>
                  <LiteratureCover
                    url={_get(series, 'metadata.cover_metadata.urls.large')}
                  />
                </Grid.Column>
                <Grid.Column width={6}>
                  <ILSHeaderPlaceholder isLoading={isLoading}>
                    <SeriesTitle />
                  </ILSHeaderPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={1}
                    isLoading={isLoading}
                  >
                    <SeriesAuthors
                      prefix="by "
                      itemProps={{ as: 'h4' }}
                      metadata={series.metadata}
                    />
                  </ILSParagraphPlaceholder>
                  <ILSParagraphPlaceholder
                    linesNumber={20}
                    isLoading={isLoading}
                  >
                    <ShowMoreContent
                      lines={20}
                      content={series.metadata.abstract}
                    />
                  </ILSParagraphPlaceholder>
                </Grid.Column>
                <Grid.Column width={5}>
                  <SeriesAccess />
                  <SeriesSequences relations={series.metadata.relations} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <SeriesPanelMobile />
        </Responsive>
      </>
    );
  }
}

SeriesPanel.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  series: PropTypes.object.isRequired,
};

export default Overridable.component('SeriesPanel', SeriesPanel);
