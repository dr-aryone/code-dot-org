import PropTypes from 'prop-types';
import React from 'react';
import Pointable from 'react-pointable';
import {connect} from 'react-redux';
import classNames from 'classnames';
import GameButtons from '../templates/GameButtons';
import ArrowButtons from '../templates/ArrowButtons';
import BelowVisualization from '../templates/BelowVisualization';
import {GAME_HEIGHT, GAME_WIDTH, GAMELAB_DPAD_CONTAINER_ID} from './constants';
import CompletionButton from '../templates/CompletionButton';
import ProtectedStatefulDiv from '../templates/ProtectedStatefulDiv';
import ProtectedVisualizationDiv from '../templates/ProtectedVisualizationDiv';
import VisualizationOverlay from '../templates/VisualizationOverlay';
import CrosshairOverlay from '../templates/CrosshairOverlay';
import TooltipOverlay, {coordinatesProvider} from '../templates/TooltipOverlay';
import i18n from '@cdo/locale';
import {toggleGridOverlay} from './actions';
import GridOverlay from './GridOverlay';
import TextConsole from './TextConsole';
import {
  cancelLocationSelection,
  selectLocation,
  updateLocation,
  isPickingLocation
} from './locationPickerModule';
import {calculateOffsetCoordinates} from '../utils';

const MODAL_Z_INDEX = 1050;

const styles = {
  containedInstructions: {
    marginTop: 10
  },
  selectStyle: {
    width: GAME_WIDTH
  }
};

class GameLabVisualizationColumn extends React.Component {
  static propTypes = {
    finishButton: PropTypes.bool.isRequired,
    isResponsive: PropTypes.bool.isRequired,
    isShareView: PropTypes.bool.isRequired,
    isProjectLevel: PropTypes.bool.isRequired,
    spriteLab: PropTypes.bool.isRequired,
    awaitingContainedResponse: PropTypes.bool.isRequired,
    pickingLocation: PropTypes.bool.isRequired,
    showGrid: PropTypes.bool.isRequired,
    toggleShowGrid: PropTypes.func.isRequired,
    cancelPicker: PropTypes.func.isRequired,
    selectPicker: PropTypes.func.isRequired,
    updatePicker: PropTypes.func.isRequired,
    consoleMessages: PropTypes.array.isRequired
  };

  // Cache app-space mouse coordinates, which we get from the
  // VisualizationOverlay when they change.
  state = {
    mouseX: -1,
    mouseY: -1
  };

  pickerPointerMove = e => {
    if (this.props.pickingLocation) {
      this.props.updatePicker(
        calculateOffsetCoordinates(this.divGameLab, e.clientX, e.clientY)
      );
    }
  };

  pickerPointerUp = e => {
    if (this.props.pickingLocation) {
      this.props.selectPicker(
        calculateOffsetCoordinates(this.divGameLab, e.clientX, e.clientY)
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    // Use jQuery to turn on and off the grid since it lives in a protected div
    if (nextProps.showGrid !== this.props.showGrid) {
      if (nextProps.showGrid) {
        $('#grid-checkbox')[0].className = 'fa fa-check-square-o';
        $('#grid-overlay')[0].style.display = '';
      } else {
        $('#grid-checkbox')[0].className = 'fa fa-square-o';
        $('#grid-overlay')[0].style.display = 'none';
      }
    }
    // Also manually raise/lower the zIndex of the playspace when selecting a
    // location because of the protected div
    const zIndex = nextProps.pickingLocation ? MODAL_Z_INDEX : 0;
    const visualizationOverlay = document.getElementById(
      'visualizationOverlay'
    );
    this.divGameLab.style.zIndex = zIndex;
    visualizationOverlay.style.zIndex = zIndex;
  }

  onMouseMove = (mouseX, mouseY) => this.setState({mouseX, mouseY});

  renderAppSpaceCoordinates() {
    const {mouseX, mouseY} = this.state;
    if (this.props.isShareView) {
      return null;
    } else if (
      mouseX < 0 ||
      mouseY < 0 ||
      mouseX > GAME_WIDTH ||
      mouseY > GAME_HEIGHT
    ) {
      // Render placeholder space so layout is stable.
      return <div>&nbsp;</div>;
    }
    return (
      <div>
        <span style={{display: 'inline-block', minWidth: '3.5em'}}>
          x: {Math.floor(mouseX)},
        </span>
        <span>y: {Math.floor(mouseY)}</span>
      </div>
    );
  }

  renderGridCheckbox() {
    return (
      <div
        style={{textAlign: 'left'}}
        onClick={() => this.props.toggleShowGrid(!this.props.showGrid)}
      >
        <i id="grid-checkbox" className="fa fa-square-o" style={{width: 14}} />
        <span style={{marginLeft: 5}}>Show grid</span>
      </div>
    );
  }

  render() {
    const {isResponsive, isShareView} = this.props;
    const divGameLabStyle = {
      touchAction: 'none',
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    };
    if (this.props.pickingLocation) {
      divGameLabStyle.zIndex = MODAL_Z_INDEX;
    }
    const spriteLab = this.props.spriteLab;

    return (
      <span>
        <ProtectedVisualizationDiv>
          <Pointable
            id="divGameLab"
            style={divGameLabStyle}
            tabIndex="1"
            onPointerMove={this.pickerPointerMove}
            onPointerUp={this.pickerPointerUp}
            elementRef={el => (this.divGameLab = el)}
          />
          <VisualizationOverlay
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            onMouseMove={this.onMouseMove}
          >
            <GridOverlay show={this.props.showGrid} showWhileRunning={true} />
            <CrosshairOverlay flip={spriteLab} />
            <TooltipOverlay providers={[coordinatesProvider(spriteLab)]} />
          </VisualizationOverlay>
        </ProtectedVisualizationDiv>
        <TextConsole consoleMessages={this.props.consoleMessages} />
        <GameButtons>
          <ArrowButtons />

          <CompletionButton />

          {!spriteLab && !isShareView && this.renderGridCheckbox()}
        </GameButtons>
        {!spriteLab && this.renderAppSpaceCoordinates()}
        <ProtectedStatefulDiv
          id={GAMELAB_DPAD_CONTAINER_ID}
          className={classNames({responsive: isResponsive})}
        />
        {this.props.awaitingContainedResponse && (
          <div style={styles.containedInstructions}>
            {i18n.predictionInstructions()}
          </div>
        )}
        <BelowVisualization />
        {this.props.pickingLocation && (
          <div
            className={'modal-backdrop'}
            onClick={() => this.props.cancelPicker()}
          />
        )}
      </span>
    );
  }
}

export default connect(
  state => ({
    isResponsive: state.pageConstants.isResponsive,
    isShareView: state.pageConstants.isShareView,
    isProjectLevel: state.pageConstants.isProjectLevel,
    spriteLab: state.pageConstants.isBlockly,
    awaitingContainedResponse: state.runState.awaitingContainedResponse,
    showGrid: state.gridOverlay,
    pickingLocation: isPickingLocation(state.locationPicker),
    consoleMessages: state.textConsole
  }),
  dispatch => ({
    toggleShowGrid: mode => dispatch(toggleGridOverlay(mode)),
    cancelPicker: () => dispatch(cancelLocationSelection()),
    updatePicker: loc => dispatch(updateLocation(loc)),
    selectPicker: loc => dispatch(selectLocation(loc))
  })
)(GameLabVisualizationColumn);
