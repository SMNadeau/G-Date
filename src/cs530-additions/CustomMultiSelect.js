import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';

const CustomMultiSelect = (props) => {
  const [selectedTeam, setSelectedTeam] = useState({});
  const [selectedTeams, setSelectedTeams] = useState([]);

  const K_OPTIONS = [
    {
      item: '18-21',
      id: 'JUVE',
    },
    {
      item: '21-25',
      id: 'RM',
    },
    {
      item: '26-30',
      id: 'BR',
    },
    {
      item: '31-35',
      id: 'PSG',
    },
    {
      item: '36-40',
      id: 'FBM',
    },
  ];
  const onMultiChange = () => {
    console.log(selectedTeams.id);
    return (item) => setSelectedTeams(xorBy(selectedTeams, [item], 'id'));
  };

  const onChange = () => {
    return (val) => setSelectedTeam(val);
  };
  return (
    <SelectBox
      label={props.question}
      options={props.answers}
      selectedValues={selectedTeams}
      onMultiSelect={onMultiChange()}
      onTapClose={onMultiChange()}
      isMulti
    />
  );
};

export default CustomMultiSelect;
