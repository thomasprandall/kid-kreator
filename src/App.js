import React from 'react';
import { useState, useCallback, useEffect } from 'react';

import { Disclosure } from '@headlessui/react';
import './App.css';

import { Navbar } from './components/navbar';
import classes from './classes.json';

const Header = (selectedKid) => {
  return (
    <Navbar props={selectedKid} />
  )
};

const Kid = ({ kid, selectedKid, onClick, deleteClick, index }) => (
  <>
    <Disclosure className={(kid.name === selectedKid.name ? 'bg-orange' : '') + ' p-1 border-solid border-b-2'} onClick={() => onClick(kid)}>
      <h1>
        {kid.name}, {kid.type}
        <span className="float-right" onClick={(index) => deleteClick(index)}>X</span>
      </h1>
    </Disclosure>
  </>
);

const Item = (props) => (
  <>
    <div className={(props.row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field flex'>
        <label htmlFor={'item_' + props.row} className='mr-2 flex-nowrap'>{props.row + 1}.</label>
        <input type='text' name={'item_' + props.row} id={'item_' + props.row} className='grow' defaultValue={props.selectedKid.items[props.row]} />
      </div>
    </div>
  </>
)

const HideoutDetail = function (props) {
  let feature = props.selectedKid.hideout.details[props.row];

  return (
    <div className={(props.row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field'>
        <input type='text' name={'hideout_' + props.row} id={'item_' + props.row} className='w-full' defaultValue={feature} />
      </div>
    </div>
  )
}

const HideoutRows = function(props){
  let hideoutArray = [];
  for (let i = 0; i < props.maxRows; i++) {
    hideoutArray.push(<HideoutDetail row={i} selectedKid={props.selectedKid} key={'hd_'+i} />)
  }

  return (
    hideoutArray
  )
};

const ItemRows = function(props){
  const itemArray = [];
  for (let i = 0; i < props.maxRows; i++) {
    itemArray.push(<Item row={i} selectedKid={props.selectedKid} key={i} />);
  }
  return(
    itemArray
  )
};

const AgeAlert = ({validAge}) => {
  return (
    <div className={(validAge ? 'hidden' : 'block') + ' box-shadow shadow-lg bg-warning text-white p-1 text-center text-sm'}>Attributes Exceed Age!</div>
  )
}

const Relationship = (props) => (
  <div className='p-3'>
    <input type='text' name="relationship_kid" value={props.selectedKid.relationships[props.row]?.kid} className='sm:block sm:w-full sm:mb-1 md:inline md:w-1/5 mr-1' onChange={(evt) => props.updateRelationship(props.row, 'kid', evt.target.value)} />
    <input type='text' name="relationship_relationship" value={props.selectedKid.relationships[props.row]?.relationship} className='sm:block sm:w-full md:inline md:w-3/4 mr-1' onChange={(evt) => props.updateRelationship(props.row, 'relationship', evt.target.value)} />
    <button onClick={() => props.deleteRelationship(props.row)}>X</button>
  </div>
)

const RelationshipRows = function (props) {
  const relationshipArray = [];
  for (let i = 0; i < props.maxRows; i++) {
    relationshipArray.push(<Relationship row={i} selectedKid={props.selectedKid} key={i} deleteRelationship={props.deleteRelationship} updateRelationship={props.updateRelationship} />);
  }
  return (
    relationshipArray
  )
};

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
          selectedKidSet(data[0]);
          localStorage.setItem("kids",JSON.stringify(data));
        });
    } else {
      kidsSet(savedKids);
      selectedKidSet(savedKids[0]);
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

  const updateAttribute = useCallback((key, value, index) => {
    const newAttributes = { ...selectedKid.attributes, [key]: value*1 }
    const newKid = {...selectedKid, attributes: newAttributes};
    selectedKidSet(newKid);

    updateKidList(newKid,index);
    
    validateAge(selectedKid.age, newAttributes);
    attributeTotalSet(getAttributeTotal(newAttributes));
  },[selectedKid, updateKidList, validateAge]);

  const updateCondition = useCallback((key, value, index) => {
    let newKid = JSON.parse(JSON.stringify(kids[index]));
    newKid.conditions[key] = value * 1;
    
    selectedKidSet(newKid);

    updateKidList(newKid, index);
  }, [kids, updateKidList]);
  
  const updateSkill = useCallback((key, value, index) => {
    let newKid = JSON.parse(JSON.stringify(kids[index]));;
    newKid.skills[key] = value * 1;
    selectedKidSet(newKid);

    let updatedKids = [...kids];
    updatedKids[index] = newKid;
    kidsSet(updatedKids);
  }, [kids]);

  const updateKidDetails = useCallback((key, value, index) => {
    let newKid = JSON.parse(JSON.stringify(kids[index]));;
    newKid[key] = value;
    selectedKidSet(newKid);

    updateKidList(newKid, index);

    if (key === 'age') {
      validateAge(value, selectedKid.attributes);
    }
  }, [kids, selectedKid, updateKidList, validateAge]);  

  const changeKid = useCallback((kid) => {
    selectedKidSet(kid);
    
    validateAge(kid.age, kid.attributes);

    attributeTotalSet(getAttributeTotal(kid.attributes));
  },[validateAge]);

  const createKid = useCallback(() => {
    let newKid = JSON.parse(JSON.stringify(kids[kids.length-1]));
    
    const kidKeys = Object.keys(newKid);

    kidKeys.forEach((key, val) => {
      newKid[key] = "";
    });

    const randNum = Math.random();
    newKid.name = "New Kid " + randNum;
    newKid.type = "Popular Kid";
    newKid.age = 10;
    newKid.luck = 5;
   
    newKid.conditions = {
      "upset": false,
      "scared": false,
      "exhausted": false,
      "injured": false,
      "broken": false
    };
    newKid.attributes = {
      "body": 0,
      "tech": 0,
      "heart": 0,
      "mind": 0
    };
    newKid.skills = {
      "sneak": 0,
      "force": 0,
      "move": 0,
      "tinker": 0,
      "program": 0,
      "calculate": 0,
      "contact": 0,
      "charm": 0,
      "lead": 0,
      "investigate": 0,
      "comprehend": 0,
      "empathize": 0
    }
    newKid.relationships = [];
    newKid.items = [];
    newKid.hideout = {
      "name": "Hideout",
      "details": []
    }

    kidsSet([...kids, newKid]);

    changeKid(newKid);
  },[kids,changeKid]);

  const deleteKid = useCallback((index) => {
    let updatedKids = JSON.parse(JSON.stringify(kids));
    updatedKids.splice(index,1);

    kidsSet(updatedKids);

    localStorage.setItem("kids",JSON.stringify(updatedKids));
    
    changeKid(kids[0]);
  },[kids,changeKid]);

  const updateRelationship = useCallback((row, field, value) => {
    const kidIndex = kids.findIndex((kid) => kid.name === selectedKid.name);

    let newKid = JSON.parse(JSON.stringify(selectedKid));
    
    newKid.relationships[row][field] = value;
    
    selectedKidSet(newKid);

    updateKidList(newKid, kidIndex);
  }, [kids, selectedKid, updateKidList]);

  const deleteRelationship = useCallback((index) => {

    updateRelationship(index,'kid','');
    updateRelationship(index, 'relationship', '');

  }, [updateRelationship]
  );

  if (!kids || !selectedKid) {
    return <div>Loading data</div>;
  }

  const expMax = 10;
  const luckMax = 5;

  const expBoxes = [];
  const luckBoxes = [];

  for (let i = 0; i < expMax; i++) {
    expBoxes.push(<input type='checkbox' name={'exp_' + i} className="exp-box" key={'exp_' + i} />);
  }

  for (let i = 0; i < luckMax; i++) {
    luckBoxes.push(<input type='checkbox' name={'luck_' + i} className='luck-box' disabled={i >= 15 - selectedKid.age} key={'luck_' + i} />);
  }

  return (
    <div className="app-wrapper container mx-auto">
      <Header selectedKid={selectedKid} kids={kids} />
      <div className='kid-container flex flex-row'>
        <div className='kid-list hidden md:block'>
          {kids.map((item, index) => (
            <Kid kid={item} selectedKid={selectedKid} key={'kid_' + kids.findIndex((kid) => kid.name === item.name)} onClick={(item) => changeKid(item)} deleteClick={() => deleteKid(index)} index={index} />
          ))}
          <div className='text-center m-2'><button onClick={createKid} className='px-2 py-1 border-solid border-2 rounded-lg bg-white text-black hover:bg-orange'>Add Kid</button></div>
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
          <div className='kid-alt-tables p-3 w-full lg:w-96'>
            <div className='kid-attributes border-b-0'>
              <div className='kid-header'>Attributes <span className='float-right'><span id="attribute-total">{ attributeTotal }</span>/{selectedKid.age}</span></div>
              <div className='kid-alt-table w-full lg:w-auto'>
                  <AgeAlert validAge={validAge} />
                  { Object.keys(selectedKid.attributes).map(function(key,i) {
                      return( 
                        <div className={(i % 2 ? 'bg-tan' : 'bg-orange-light') + ' flex border-solid border-b-2'} key={key}>
                          <div className='grow w-4/6 capitalize p-1'>
                            <label htmlFor={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)} className='align-middle'>{key}</label>
                          </div>
                          <div className='shrink w-2/6 p-1'>
                            <input 
                              type="number" 
                              id={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}
                              name={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)} 
                              value={ selectedKid.attributes[key] }
                              max="5"
                              min="1"
                              className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                              size="2"
                              onChange={(evt) => updateAttribute(key, evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} /> 
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
                          <label htmlFor={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}>{key}</label>
                        </div>
                        <div className='shrink w-1/6 p-1'>
                          <input
                            id={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}
                            type="checkbox"
                            name={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}
                            checked={selectedKid.conditions[key]}
                            value="true"
                            onChange={(evt) => updateCondition(key, evt.target.checked, kids.findIndex((kid) => kid.name === selectedKid.name))}
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
                          <label htmlFor={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}>{key}</label>
                        </div>
                        <div className='shrink w-2/6 p-1'>
                          <input
                            type="number"
                            id={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}
                            name={key + "_" + kids.findIndex((kid) => kid.name === selectedKid.name)}
                            value={selectedKid.skills[key]}
                            max={classes[selectedKid.type].keySkills.find(skill => skill === key) ? 3:1}
                            min="0"
                            className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                            size="2"
                            onChange={(evt) => updateSkill(key, evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} />
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
          <div className='kid-character p-3 basis-80 grow'>
             
            <div className='kid-details bg-tan'>
              <div className='kid-header'>Kid Details</div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'name_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='inline-block w-20'>Name:</label>
                  <input name={'name_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'name_' + kids.findIndex((kid) => kid.name === selectedKid.name)} type='text' value={selectedKid.name} onChange={(evt) => updateKidDetails('name', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow'>
                  <select name={'type_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'type_' + kids.findIndex((kid) => kid.name === selectedKid.name)} type='text' className='m-1 w-11/12' value={selectedKid.type} onChange={(evt) => updateKidDetails('type', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} >
                    { typeOptions }
                  </select>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'age_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='inline-block w-20'>Age:</label>
                  <input name={'age_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'age_' + kids.findIndex((kid) => kid.name === selectedKid.name)} type='number' value={selectedKid.age} onChange={(evt) => updateKidDetails('age', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} min="10" max="15" className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow bg-orange-light align-middle'>
                  <label htmlFor={'luck_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='inline-block w-20'>Luck Points:</label>
                  <div className='inline-block'>
                    {luckBoxes}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'drive_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='inline-block w-20'>Drive:</label>
                  <input name={'drive_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'drive_' + kids.findIndex((kid) => kid.name === selectedKid.name)} type='text' value={selectedKid.drive} onChange={(evt) => updateKidDetails('drive', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'anchor_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='inline-block w-20'>Anchor:</label>
                  <input name={'anchor_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'anchor_' + kids.findIndex((kid) => kid.name === selectedKid.name)} type='text' value={selectedKid.anchor} onChange={(evt) => updateKidDetails('anchor', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} className='m-1 w-auto md:w-9/12 lg:w-8/12' />
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field p2'>
                  <p><label htmlFor={'problem_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className=''>Problem:</label></p>
                  <textarea name={'problem_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'problem_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='w-full' value={selectedKid.problem} onChange={(evt) => updateKidDetails('problem', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'pride_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className=''>Pride: <span className='float-right'>Checked? <input type='checkbox' name={'prideUsed_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='float-right' /></span></label></p>
                  <textarea name={'pride_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'pride_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='w-full' value={selectedKid.pride} onChange={(evt) => updateKidDetails('pride', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'description_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className=''>Description:</label></p>
                  <textarea name={'description_' + kids.findIndex((kid) => kid.name === selectedKid.name)} id={'description_' + kids.findIndex((kid) => kid.name === selectedKid.name)} className='w-full' value={selectedKid.description} onChange={(evt) => updateKidDetails('description', evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))}></textarea>
                </div>
              </div>
            </div>
          
            <div className='kid-relationships border-solid border-2 bg-tan'>
              <div className='kid-header'>Relationships</div>
              <RelationshipRows maxRows='5' selectedKid={selectedKid} deleteRelationship={deleteRelationship} updateRelationship={updateRelationship} />
            </div>
            <div className='kid-items border-solid border-2 bg-tan'>
              <div className='kid-header'>Items</div>
              <ItemRows maxRows='5' selectedKid={selectedKid} />
            </div>
            <div className='kid-hideout border-solid border-2 bg-tan'>
              <div className='kid-header hideout'>{ selectedKid.hideout.name }</div>
              <HideoutRows selectedKid={selectedKid} maxRows='6' />
            </div>
            <div className='kid-notes border-solid border-2 bg-tan'>
              <div className='kid-header'>Notes</div>
              <textarea name={'notes_' + kids.findIndex((kid) => kid.name === selectedKid.name)} defaultValue={selectedKid.notes} className='w-full h-80'></textarea>
            </div> 
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
