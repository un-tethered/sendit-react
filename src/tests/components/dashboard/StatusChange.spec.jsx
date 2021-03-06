import React from 'react';
import { shallow } from 'enzyme';
import '@babel/polyfill';
import axios from '../../../utils/axiosConfig';
import parcels from '../../mocks/mockParcels';
import StatusChange from '../../../components/adminDashboard/content/StatusChange';

jest.mock('../../../utils/axiosConfig');

const tick = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  })
};

test('Should render static component', async () => {
  const wrapper = shallow(<StatusChange />);
  expect(wrapper).toMatchSnapshot();
});

test('Should handle input interactions', async () => {
  const wrapper = shallow(<StatusChange />);
  wrapper.find('input').simulate('change', { target: { value: 3 } });
  expect(wrapper.state('parcelId')).toBe(3);

  wrapper.find('input').simulate('blur');
  expect(wrapper.state('parcelIdErrorMessage')).toBe('');

  wrapper.find('input').simulate('change', { target: { value: 'p' } });
  expect(wrapper.state('parcelId')).toBe('p');

  wrapper.find('input').simulate('blur');
  expect(wrapper.state('parcelIdErrorMessage')).toBe('must be a number.');
});

test('Should handle submit interactions', async () => {
  axios.patch.mockRejectedValue({ response: { data: { error: 'error' } } });
  const wrapper = shallow(<StatusChange />);
  wrapper.find('button').simulate('click', { preventDefault: jest.fn() });
  expect(wrapper.state('parcelIdErrorMessage')).toBe('must be a number.');

  wrapper.find('input').simulate('change', { target: { value: 2 } });
  expect(wrapper.state('parcelId')).toBe(2);

  wrapper.find('select').simulate('blur', { target: { value: 'created' } });
  expect(wrapper.state('status')).toBe('created');

  wrapper.find('button').simulate('click', { preventDefault: jest.fn() });

  axios.patch.mockResolvedValue({ data: { parcel: parcels[0] } });
  wrapper.find('button').simulate('click', { preventDefault: jest.fn() });
  await tick();
  expect(wrapper.state('status')).toBe('created');

});
