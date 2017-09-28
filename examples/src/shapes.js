import PropTypes from 'prop-types';

export const dataShape = PropTypes.shape({
  date: PropTypes.instanceOf(Date).isRequired,
  close: PropTypes.number.isRequired,
});

export const marginShape = PropTypes.shape({
  top: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
});
