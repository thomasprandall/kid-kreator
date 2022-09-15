import React from 'react';

import './App.css';

import { Header, AgeAlert } from './components/layout';
import { Kid } from './components/kid';
import { HideoutDetail, Item, Relationship } from './components/form';

import classes from './classes.json';

import { useKid, useKids, useSelectKid, useAddKid, useSetKids, useFetch} from './store-z';

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
  typeOptions.push(<option defaultValue={type} key={'type_' + type}>{type}</option>);
});

const getKidID = (kid, kids) => {
  return kids.findIndex((k) => k.name === kid.name)
}

function App() {
  const kids = useKids();
  const selectedKid = useKid();
  const selectKid = useSelectKid();
  const kidFetch = useFetch();
  const addKid = useAddKid();
  const setKids = useSetKids();
  
  if (!kids.length){
    kidFetch();
  } else if (!Object.keys(selectedKid).length) {
    selectKid(0);
  }

  const selectedKidID = getKidID(selectedKid, kids);

  const deleteKid = (id) => {
    let newKids = JSON.parse(JSON.stringify(kids));
    if(id < kids.length){
      newKids.splice(id, 1);
      setKids(newKids);
      selectKid(0);
    }
  }

  const updateKidField = (kid, evt) => {
    const index = getKidID(kid, kids);
    const newKid = {...kid, [evt.target.name]: evt.target.value};
    let newKids = kids;
    newKids[index] = newKid;
    setKids(newKids);
    selectKid(index);
  }

  const validAge = false;
  const attributeTotal = 0;
  // return (
  //   <div style={{ fontSize: "smaller", fontFamily: "monospace" }}>
  //     {JSON.stringify(kids)}
  //     <hr />
  //     {JSON.stringify(selectedKid)}
  //   </div>
  // )
  if (!kids.length || !selectedKid) {
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
      <div style={{ fontSize: "smaller", fontFamily: "monospace", display: "none" }}>
        {JSON.stringify(kids)}
        <hr />
        {JSON.stringify(selectedKid)}
      </div>
      <Header selectedKid={selectedKid} kids={kids} />
      <div className='kid-container flex flex-row'>
        <div className='kid-list hidden md:block'>
          {kids.map((item, index) => (
            <Kid kid={item} selected={item.name === selectedKid.name} key={'kid_' + kids.findIndex((kid) => kid.name === item.name)} index={index} changeKid={selectKid} deleteKid={deleteKid} />
          ))}
          <div className='text-center m-2'><button onClick={addKid} className='px-2 py-1 border-solid border-2 rounded-lg bg-white text-black hover:bg-orange'>Add Kid</button></div>
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
                  {/* <AgeAlert validAge={validAge} /> */}
                  { Object.keys(selectedKid.attributes).map(function(key,i) {
                      return( 
                        <div className={(i % 2 ? 'bg-tan' : 'bg-orange-light') + ' flex border-solid border-b-2'} key={key}>
                          <div className='grow w-4/6 capitalize p-1'>
                            <label htmlFor={key + "_" + selectedKidID} className='align-middle'>{key}</label>
                          </div>
                          <div className='shrink w-2/6 p-1'>
                            <input 
                              type="number" 
                              id={key + "_" + selectedKidID}
                              name={key} 
                              defaultValue={ selectedKid.attributes[key] }
                              max="5"
                              min="1"
                              className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                              size="2" />
                              {/* onChange={(evt) => updateAttribute(key, evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} />  */}
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
                          <label htmlFor={key + "_" + selectedKidID}>{key}</label>
                        </div>
                        <div className='shrink w-1/6 p-1'>
                          <input
                            id={key + "_" + selectedKidID}
                            type="checkbox"
                            name={key}
                            defaultChecked={selectedKid.conditions[key]}
                            defaultValue="true"
                          />
                            {/* onChange={(evt) => updateCondition(key, evt.target.checked, kids.findIndex((kid) => kid.name === selectedKid.name))} */}
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
                          <label htmlFor={key + "_" + selectedKidID}>{key}</label>
                        </div>
                        <div className='shrink w-2/6 p-1'>
                          <input
                            type="number"
                            id={key + "_" + selectedKidID}
                            name={key}
                            defaultValue={selectedKid.skills[key]}
                            max={classes[selectedKid.type].keySkills.find(skill => skill === key) ? 3:1}
                            min="0"
                            className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                            size="2"/>
                            {/* onChange={(evt) => updateSkill(key, evt.target.value, kids.findIndex((kid) => kid.name === selectedKid.name))} /> */}
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
                  <label htmlFor='name' className='inline-block w-20'>Name:</label>
                  <input name="name" id='name' type='text' value={selectedKid.name} className='m-1 w-auto md:w-9/12' onChange={(evt) => updateKidField(selectedKid, evt)} />
                </div>
                <div className='kid-field grow'>
                  <select name='type' id='type' type='text' className='m-1 w-11/12' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.type}>
                    { typeOptions }
                  </select>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'age_' + selectedKidID} className='inline-block w-20'>Age:</label>
                  <input name='age' id={'age_' + selectedKidID} type='number' value={selectedKid.age} onChange={(evt) => updateKidField(selectedKid, evt)} min="10" max="15" className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow bg-orange-light align-middle'>
                  <label htmlFor={'luck_' + selectedKidID} className='inline-block w-20'>Luck Points:</label>
                  <div className='inline-block'>
                    {luckBoxes}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap field-row'>
                <div className='kid-field grow'>
                  <label htmlFor={'drive_' + selectedKidID} className='inline-block w-20'>Drive:</label>
                  <input name='drive' id={'drive_' + selectedKidID} type='text' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.drive} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'anchor_' + selectedKidID} className='inline-block w-20'>Anchor:</label>
                  <input name='anchor' id={'anchor_' + selectedKidID} type='text' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.anchor} className='m-1 w-auto md:w-9/12 lg:w-8/12' />
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field p2'>
                  <p><label htmlFor={'problem_' + selectedKidID} className=''>Problem:</label></p>
                  <textarea name='problem' id={'problem_' + selectedKidID} className='w-full' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.problem}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'pride_' + selectedKidID} className=''>Pride: <span className='float-right'>Checked? <input type='checkbox' name={'prideUsed_' + selectedKidID} className='float-right' /></span></label></p>
                  <textarea name='pride' id={'pride_' + selectedKidID} className='w-full' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.pride}></textarea>
                </div>
              </div>
              <div className='field-row'>
                <div className='kid-field'>
                  <p><label htmlFor={'description_' + selectedKidID} className=''>Description:</label></p>
                  <textarea name='description' id={'description_' + selectedKidID} className='w-full' onChange={(evt) => updateKidField(selectedKid, evt)} value={selectedKid.description}></textarea>
                </div>
              </div>
            </div>
          
            <div className='kid-relationships border-solid border-2 bg-tan'>
              <div className='kid-header'>Relationships</div>
              <RelationshipRows maxRows='5' selectedKid={selectedKid} />
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
              <textarea name={'notes_' + selectedKidID} defaultValue={selectedKid.notes} className='w-full h-80'></textarea>
            </div> 
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
