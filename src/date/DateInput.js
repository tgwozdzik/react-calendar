import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import TimeInput from 'react-time-input';

const DateInput = createReactClass({
  propTypes: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.string,
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
  },

  getInitialState() {
    const selectedValue = this.props.selectedValue;
    return {
      str: selectedValue && selectedValue.format(this.props.format) || '',
      str_time: selectedValue && selectedValue.format("HH:mm") || '',
      invalid: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    // when popup show, click body will call this, bug!
    const selectedValue = nextProps.selectedValue;

    this.setState({
      str: selectedValue && selectedValue.format(nextProps.format) || '',
      str_time: selectedValue && selectedValue.format("HH:mm") || '',
      invalid: false,
    });
  },

  onInputChange(event) {
    const str = event.target.value;
    const str_time = this.state.str_time;
    this.setState({
      str
    });
    let value;
    const { disabledDate, format, onChange } = this.props;
    if (str && str_time) {
      const parsed = moment(str, format, true);
      const parsedTime = moment(str_time, "HH:mm");
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
        });
        return;
      }
      value = this.props.value.clone();
      value
        .year(parsed.year())
        .month(parsed.month())
        .date(parsed.date())
        .hour(parsedTime.hour())
        .minute(parsedTime.minute())
        .second(0);

      if (value && (!disabledDate || !disabledDate(value))) {
        const originalValue = this.props.selectedValue;
        if (originalValue && value) {
          if (!originalValue.isSame(value)) {
            onChange(value);
          }
        } else if (originalValue !== value) {
          onChange(value);
        }
      } else {
        this.setState({
          invalid: true,
        });
        return;
      }
    } else {
      onChange(null);
    }
    this.setState({
      invalid: false,
    });
  },

  onClear() {
    this.setState({
      str: '',
    });
    this.props.onClear(null);
  },

  getRootDOMNode() {
    return ReactDOM.findDOMNode(this);
  },

  focus() {
    if (this.dateInputInstance) {
      this.dateInputInstance.focus();
    }
  },

  saveDateInput(dateInput) {
    this.dateInputInstance = dateInput;
  },

  onTimeChange(newTime) {
    const {props} = this;

    const dateValue = props.selectedValue || props.value;

    if(dateValue.format("HH:mm") === newTime) return;

    const time = moment(newTime || '00:00', "HH:mm");
    const value = dateValue.clone();
    value
      .hour(time.hour())
      .minute(time.minute())
      .second(0);

    this.setState({
      str_time: newTime
    });

    props.onChange(value);
  },

  render() {
    const props = this.props;
    const { invalid, str } = this.state;
    const { locale, prefixCls, placeholder, onFocus, onBlur, inputImage, inputTimeImage, onTimeInputFocus, onTimeInputBlur } = props;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';

    return (<div className={`${prefixCls}-input-wrap`}>
      <div className={classnames(`${prefixCls}-date-input-wrap`, {'input-image': !!inputImage})}>
        <div className={`${prefixCls}-input-date-container`}>
          {inputImage ? <div>{inputImage}</div> : null}
          <input
            ref={this.saveDateInput}
            className={`${prefixCls}-input ${prefixCls}-input-date ${invalidClass}`}
            value={str}
            disabled={props.disabled}
            placeholder={placeholder}
            onChange={this.onInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div className={`${prefixCls}-input-time-container`}>
          {inputTimeImage ? <div>{inputTimeImage}</div> : null}
          <TimeInput
            initTime={this.state.str_time}
            className={`${prefixCls}-input ${prefixCls}-input-time ${invalidClass}`}
            onTimeChange={this.onTimeChange}
            onFocusHandler={onTimeInputFocus}
            onBlurHandler={onTimeInputBlur}
          />
        </div>
      </div>
      {props.showClear ? <a
        className={`${prefixCls}-clear-btn`}
        role="button"
        title={locale.clear}
        onClick={this.onClear}
      /> : null}
    </div>);
  },
});

export default DateInput;
