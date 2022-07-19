import React from 'react';
import { useState, useCallback, useEffect } from 'react';

import { Disclosure } from '@headlessui/react';
import './App.css';

import { Navbar } from './components/navbar';

// import kids from './kids.json';
import classes from './classes.json';

const Header = () => {
  return (
    <Navbar />
  )
};

const Kid = ({ kid, selectedKid, onClick }) => (
  <>
    <Disclosure className={(kid.id === selectedKid.id ? 'bg-orange' : '') + ' p-1 border-solid border-b-2'} onClick={() => onClick(kid)}>
      <h1>
        {kid.name}, {kid.type}
      </h1>
    </Disclosure>
  </>
)

const Relationship = ({ rel, selectedKid }) => (
  <div className={(rel.index < selectedKid.relationships.length ? 'border-b-2':'border-b-0') + ' p-3'}>
    <input type='text' defaultValue={rel.kid} className='sm:block sm:w-full sm:mb-1 md:inline md:w-1/5' /> <input type='text' defaultValue={rel.relationship} className='sm:block sm:w-full md:inline md:w-3/4' />
  </div>
)

const Item = (row, {selectedKid}) => (
  <>
    <div className={(row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field flex'>
        <label htmlFor={'item_' + selectedKid.id + '_' + row} className='mr-2 flex-nowrap'>{row + 1}.</label>
        <input type='text' name={'item_' + selectedKid.id + '_' + row} id={'item_' + selectedKid.id + '_' + row} className='grow' defaultValue={selectedKid.items[row]} />
      </div>
    </div>
  </>
)

const HideoutDetail = function (row,{ selectedKid }) {
  let feature = selectedKid.hideout.details[row];
  return (
    <div className={(row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field'>
        <input type='text' name={'hideout_' + selectedKid.id + '_' + row} id={'item_' + selectedKid.id + '_' + row} className='w-full' defaultValue={feature} />
      </div>
    </div>
  )
}

const HideoutRows = function(maxRows, {selectedKid}){
  let hideoutArray = [];
  for (let i = 0; i < maxRows; i++) {
    hideoutArray.push(<HideoutDetail row={i} selectedKid={selectedKid} />)
  }

  return (
    {hideoutArray}
  )
};

const ItemRows = function(maxRows, {selectedKid}){
  let itemArray = [];
  for (let i = 0; i < maxRows; i++) {
    itemArray.push(<Item row={i} selectedKid={selectedKid} />);
  }
  return(
    {itemArray}
  )
};

const AgeAlert = ({validAge}) => {
  return (
    <div className={(validAge ? 'hidden' : 'block') + ' box-shadow shadow-lg bg-warning text-white p-1 text-center text-sm'}>Attributes Exceed Age!</div>
  )
}

const expMax = 10;
const luckMax = 5;
const itemMax = 5;
const hideoutMax = 6;

const expBoxes = [];
const luckBoxes = [];
const itemRows = [];
const hideoutRows = [];

for (let i = 0; i < expMax; i++) {
  expBoxes.push(<input type='checkbox' name={'exp_' + i} className="exp-box" disabled={i > 0} key={'exp_'+i} />);
}

for (let i = 0; i < luckMax; i++) {
  luckBoxes.push(<input type='checkbox' name={'luck_' + i} className='luck-box' key={'luck_' + i} />);
}

const kidTypes = Object.keys(classes);
const typeOptions = [];

kidTypes.forEach(type => {
  typeOptions.push(<option value={type} key={'type_' + type}>{type}</option>);
});



function App() {
  const [kids, kidsSet] = useState([]);

  useEffect(() => {
    const savedKids = JSON.parse(localStorage.getItem("kids"));
    
    if (!savedKids){
      fetch("/kids.json")
        .then((resp) => resp.json())
        .then((data) => {
          kidsSet(data);
          changeKid(data[0]);
          localStorage.setItem("kids",JSON.stringify(data));
        });
    } else {
      kidsSet(savedKids);
      changeKid(savedKids[0]);
    }
  },[]);

  const [selectedKid, selectedKidSet] = useState(null);

  const [validAge, validAgeSet] =  useState(true);
  const [attributeTotal, attributeTotalSet] = useState(0);

  const updateKidList = useCallback((newKid, index) => {
    let updatedKids = [...kids];
    updatedKids[index] = newKid;
    kidsSet(updatedKids);

    localStorage.setItem("kids",JSON.stringify(updatedKids));
  },[kids]);

  const validateAge = useCallback((age, attributes) => {
    let attributeTotal = getAttributeTotal(attributes);
    
    validAgeSet(age >= attributeTotal);
  },[]);

  const getAttributeTotal = (attributes) => {
    const attributeValues = Object.values(attributes);
    const attributeTotal = attributeValues.reduce((total, current) => {
      return total + current;
    }, 0);
    
    return attributeTotal;
  };

  const updateAttribute = useCallback((key, value, id) => {
    const newAttributes = { ...selectedKid.attributes, [key]: value*1 }
    const newKid = {...selectedKid, attributes: newAttributes};
    selectedKidSet(newKid);

    updateKidList(newKid,id-1);
    
    validateAge(selectedKid.age, newAttributes);
    attributeTotalSet(getAttributeTotal(newAttributes));
  },[selectedKid, updateKidList, validateAge]);

  const updateCondition = useCallback((key, value, id) => {
    let newKid = JSON.parse(JSON.stringify(kids[id - 1]));;
    newKid.conditions[key] = value * 1;
    
    selectedKidSet(newKid);

    updateKidList(newKid, id - 1);
  }, [kids, updateKidList]);
  
  const updateSkill = useCallback((key, value, id) => {
    let newKid = JSON.parse(JSON.stringify(kids[id - 1]));;
    newKid.skills[key] = value * 1;
    selectedKidSet(newKid);

    let updatedKids = [...kids];
    updatedKids[id - 1] = newKid;
    kidsSet(updatedKids);
  }, [kids]);

  const updateKidDetails = useCallback((key, value, id) => {
    console.log(key, value, id);
    let newKid = JSON.parse(JSON.stringify(kids[id - 1]));;
    newKid[key] = value;
    selectedKidSet(newKid);

    updateKidList(newKid, id - 1);

    if (key === 'age') {
      validateAge(value, selectedKid.attributes);
    }
  }, [kids, selectedKid, updateKidList, validateAge]);  

  const changeKid = (kid) => {
    selectedKidSet(kid);

    validateAge(kid.age, kid.attributes);

    attributeTotalSet(getAttributeTotal(kid.attributes));
  };

  if (!kids || !selectedKid) {
    return <div>Loading data</div>;
  }

  return (
    <div className="app-wrapper container mx-auto">
      <Header />
      <div className='kid-container flex flex-row'>
        <div className='kid-list'>
          {kids.map((item) => (
            <Kid kid={item} selectedKid={selectedKid} kids={kids} key={'kid_' + item.id} onClick={(item) => changeKid(item)} />
          ))}
          <div className='kid-help'>
            <div className='kid-header'>Help</div>
            <div>
              <ol className='m-1'>
                <li>Choose your Type</li>
                <li>Choose your Age (10 to 15)</li>
                <li>Assign Attributes (1 to 5)</li>
                <li>Assign Skills (10 points)</li>
                <li>Pick an Iconic Item</li>
                <li>Pick a Problem</li>
                <li>Pick a Drive</li>
                <li>Pick a Pride</li>
                <li>Define Relationships</li>
                <li>Select and Anchor</li>
                <li>Name your Kid</li>
                <li>Write a Description</li>
                <li>Choose Favorite Song</li>
              </ol>
            </div>
          </div>
        </div>
        <div className='kid-container w-full flex flex-wrap row' >
          <div className='kid-alt-tables p-3 w-auto md:w-96'>
            <div className='kid-attributes border-b-0'>
              <div className='kid-header'>Attributes <span className='float-right'><span id="attribute-total">{ attributeTotal }</span>/{selectedKid.age}</span></div>
              <div className='kid-alt-table w-full'>
                  <AgeAlert validAge={validAge} />
                  { Object.keys(selectedKid.attributes).map(function(key,i) {
                      return( 
                        <div className={(i % 2 ? 'bg-tan' : 'bg-orange-light') + ' flex border-solid border-b-2'} key={key}>
                          <div className='grow w-4/6 capitalize p-1'>
                            <label htmlFor={key + "_" + selectedKid.id} className='align-middle'>{key}</label>
                          </div>
                          <div className=' shrink w-2/6 p-1'>
                            <input 
                              type="number" 
                              id={key + "_" + selectedKid.id}
                              name={key + "_" + selectedKid.id} 
                              value={ selectedKid.attributes[key] }
                              max="5"
                              min="1"
                              className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                              size="2"
                              onChange={(evt) => updateAttribute(key, evt.target.value, selectedKid.id)} /> 
                          </div>
                        </div>
                      )
                    }
                  )}
              </div>
            </div>
            <div className='kid-conditions '>
              <div className='kid-header'>Conditions</div>
              <div className='kid-alt-table w-full'>
                  {Object.keys(selectedKid.conditions).map(function (key,i) {
                    return (
                      <div className={(i % 2 ? 'bg-tan' : 'bg-orange-light') + ' flex border-solid border-b-2'} key={key}>
                        <div className='grow w-5/6 capitalize p-1'>
                          <label htmlFor={key + "_" + selectedKid.id}>{key}</label>
                        </div>
                        <div className='shrink w-1/6 p-1'>
                          <input
                            id={key + "_" + selectedKid.id}
                            type="checkbox"
                            name={key + "_" + selectedKid.id}
                            checked={selectedKid.conditions[key]}
                            value="true"
                            onChange={(evt) => updateCondition(key, evt.target.checked, selectedKid.id)}
                          />
                        </div>
                      </div>
                    )
                  }
                  )}
              </div>
            </div>
            <div className='kid-skills'>
              <div className='kid-header'>Skills</div>
              <div className='kid-alt-table w-full'>
                  {Object.keys(selectedKid.skills).map(function (key,i) {
                    return (
                      <div className={(i % 2 ? 'bg-tan' : 'bg-orange-light') + ' flex border-solid border-b-2'} key={key}>
                        <div className='grow w-4/6 capitalize p-1'>
                          <label htmlFor={key + "_" + selectedKid.id}>{key}</label>
                        </div>
                        <div className='shrink w-2/6 p-1'>
                          <input
                            type="number"
                            id={key + "_" + selectedKid.id}
                            name={key + "_" + selectedKid.id}
                            value={selectedKid.skills[key]}
                            max={classes[selectedKid.type].keySkills.find(skill => skill === key) ? 3:1}
                            min="0"
                            className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                            size="2"
                            onChange={(evt) => updateSkill(key, evt.target.value, selectedKid.id)} />
                        </div>
                      </div>
                    )
                  }
                  )}
              </div>
            </div>
            <div className='kid-experience'>
              <div className='kid-header'>Experience</div>
              <div className='flex bg-orange-light p-3'>
                <div className='flex flex-wrap'>
                    {expBoxes}
                </div>
              </div>
            </div>
          </div>
          <div className='kid-character p-3 grow'>
             
            <div className='kid-details bg-tan'>
              <div className='kid-header'>Kid Details</div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'name_' + selectedKid.id} className='inline-block w-20'>Name:</label>
                  <input name={'name_' + selectedKid.id} id={'name_' + selectedKid.id} type='text' value={selectedKid.name} onChange={(evt) => updateKidDetails('name', evt.target.value, selectedKid.id)} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'type_' + selectedKid.id} className='inline-block w-20'>Type:</label>
                  <select name={'type_' + selectedKid.id} id={'type_' + selectedKid.id} type='text' className='m-1 w-auto md:w-9/12 lg:w-7/12' value={selectedKid.type} onChange={(evt) => updateKidDetails('type', evt.target.value, selectedKid.id)} >
                    { typeOptions }
                  </select>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'age_' + selectedKid.id} className='inline-block w-20'>Age:</label>
                  <input name={'age_' + selectedKid.id} id={'age_' + selectedKid.id} type='number' value={selectedKid.age} onChange={(evt) => updateKidDetails('age', evt.target.value, selectedKid.id)} min="10" max="15" className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow bg-orange-light align-middle'>
                  <label htmlFor={'luck_' + selectedKid.id} className='inline-block w-20'>Luck Points:</label>
                  <div className='inline-block'>
                    {luckBoxes}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'drive_' + selectedKid.id} className='inline-block w-20'>Drive:</label>
                  <input name={'drive_' + selectedKid.id} id={'drive_' + selectedKid.id} type='text' value={selectedKid.drive} onChange={(evt) => updateKidDetails('drive', evt.target.value, selectedKid.id)} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'anchor_' + selectedKid.id} className='inline-block w-20'>Anchor:</label>
                  <input name={'anchor_' + selectedKid.id} id={'anchor_' + selectedKid.id} type='text' value={selectedKid.anchor} onChange={(evt) => updateKidDetails('anchor', evt.target.value, selectedKid.id)} className='m-1 w-auto md:w-9/12 lg:w-8/12' />
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field p2'>
                  <p><label htmlFor={'problem_' + selectedKid.id} className=''>Problem:</label></p>
                  <textarea name={'problem_' + selectedKid.id} id={'problem_' + selectedKid.id} className='w-full' value={selectedKid.problem} onChange={(evt) => updateKidDetails('problem', evt.target.value, selectedKid.id)}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'pride_' + selectedKid.id} className=''>Pride: <span className='float-right'>Checked? <input type='checkbox' name={'prideUsed_' + selectedKid.id} className='float-right' /></span></label></p>
                  <textarea name={'pride_' + selectedKid.id} id={'pride_' + selectedKid.id} className='w-full' value={selectedKid.pride} onChange={(evt) => updateKidDetails('pride', evt.target.value, selectedKid.id)}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'description_' + selectedKid.id} className=''>Description:</label></p>
                  <textarea name={'description_' + selectedKid.id} id={'description_' + selectedKid.id} className='w-full' value={selectedKid.description} onChange={(evt) => updateKidDetails('description', evt.target.value, selectedKid.id)}></textarea>
                </div>
              </div>
            </div>
          
            <div className='kid-relationships border-solid border-2 bg-tan'>
              <div className='kid-header'>Relationships</div>
              {selectedKid.relationships.map((rel,i) => (<Relationship rel={rel} index={i} selectedKid={selectedKid}  />))}
            </div>
            <div className='kid-items border-solid border-2 bg-tan'>
              <div className='kid-header'>Items</div>
              {/* <ItemRows maxRows='5' selectedKid={selectedKid} /> */}
            </div>
            <div className='kid-hideout border-solid border-2 bg-tan'>
              <div className='kid-header'>{ selectedKid.hideout.name }</div>
              {/* <HideoutRows selectedKid={selectedKid} maxRows='6' /> */}
            </div>
            <div className='kid-notes border-solid border-2 bg-tan'>
              <div className='kid-header'>Notes</div>
              <textarea name={'notes_' + selectedKid.id} defaultValue={selectedKid.notes} className='w-full h-80'></textarea>
            </div> 
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
