import { Disclosure } from '@headlessui/react';
import './App.css';

import { Navbar } from './components/navbar';

import kids from './kids.json';
import classes from './classes.json';

const Header = () => {
  return (
    <Navbar />
  )
};

const Kid = function(kid) {
  return (
    <Disclosure className={(kid.id === selectedKid.id ? 'bg-orange' : '') + ' p-1 border-solid border-b-2'}>
      <h1 onClick={() => selectedKid = kids[kid.id] }>
        {kid.name}, {kid.type}
      </h1>
    </Disclosure>
  )
}

const Relationship = function(rel) {
  let relDetails = rel.rel;
  return (
    <div className={(rel.index+1 < selectedKid.relationships.length ? 'border-b-2':'border-b-0') + ' p-3'}>
      {rel.index + 1}. <span className='font-bold'>{relDetails.kid}</span>: {relDetails.relationship}
    </div>
  )
}

const Item = function({row}) {
  let itemDetails = selectedKid.items[row];
  return (
    <div className={(row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field px-1 w-full flex'>
        <label htmlFor={'item_' + selectedKid.id + '_' + row} className='mr-2 flex-nowrap'>{row+1}.</label>
        <input type='text' name={'item_' + selectedKid.id + '_' + row} id={'item_' + selectedKid.id + '_' + row} className='grow' defaultValue={itemDetails} />
      </div>
    </div>
  )
}

const HideoutDetail = function ({ row }) {
  let feature = selectedKid.hideout.details[row];
  return (
    <div className={(row < 5 ? 'border-b-2' : 'border-b-0') + ' p-3 flex'}>
      <div className='item-field px-1 w-full'>
        <input type='text' name={'hideout_' + selectedKid.id + '_' + row} id={'item_' + selectedKid.id + '_' + row} className='w-full' defaultValue={feature} />
      </div>
    </div>
  )
}

let selectedKid = kids[0];
let kidSkills = classes[selectedKid.type].keySkills;
const expMax = 10;
const luckMax = 5;
const itemMax = 5;
const hideoutMax = 6;

const expBoxes = [];
const luckBoxes = [];
const itemRows = [];
const hideoutRows = [];

for (let i = 0; i < expMax; i++) {
  expBoxes.push(<input type='checkbox' name={'exp_' + i} className="flex-row my-1 mx-2" disabled={i > 0} key={'exp_'+i} />);
}

for (let i = 0; i < luckMax; i++) {
  luckBoxes.push(<input type='checkbox' name={'luck_' + i} className='flex-row my-1 mx-2' defaultChecked={i < selectedKid.luck} key={'luck_' + i} />);
}

for (let i = 0; i < itemMax; i++) {
  itemRows.push(<Item row={i} />);
}

for (let i = 0; i < hideoutMax; i++) {
  hideoutRows.push(<HideoutDetail row={i} />);
}

function App() {
  return (
    <div className="app-wrapper container mx-auto">
      <Header />
      <div className='kid-container flex flex-row'>
        <div className='kid-list p-1 md:p-3 flex-none w-auto md:w-64 bg-yellow noisy border-solid border-r-2'>
          {kids.map((item) => (
            <Kid name={ item.name } type={ item.type } id={ item.id } key={ item.name + '_' + item.type } />
          ))}
          <div className='kid-attributes border-solid border-2 mt-2'>
            <div className='kid-header bg-black text-white p-1'>Help</div>
            <div>
              <ol className='m-1 list-inside'>
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
            <div className='kid-attributes border-solid border-2 border-b-0'>
              <div className='kid-header bg-black text-white p-1'>Attributes</div>
              <div className='kid-alt-table w-full'>
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
                              defaultValue={ selectedKid.attributes[key] }
                              max="5"
                              min="1"
                              className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                              size="2" /> 
                          </div>
                        </div>
                      )
                    }
                  )}
              </div>
            </div>
            <div className='kid-conditions border-solid border-2 border-b-0 mt-2'>
              <div className='kid-header bg-black text-white p-1'>Conditions</div>
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
                          />
                        </div>
                      </div>
                    )
                  }
                  )}
              </div>
            </div>
            <div className='kid-skills border-solid border-2 border-b-0 mt-2'>
              <div className='kid-header bg-black text-white p-1'>Skills</div>
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
                            defaultValue={selectedKid.skills[key]}
                            max={kidSkills.find(skill => skill === key) ? 3:1}
                            min="0"
                            className={(i % 2 ? 'bg-tan' : 'bg-orange-light')}
                            size="2" />
                        </div>
                      </div>
                    )
                  }
                  )}
              </div>
            </div>
            <div className='kid-experience border-solid border-2 mt-2'>
              <div className='kid-header bg-black text-white p-1'>Experience</div>
              <div className='flex bg-orange-light p-3'>
                <div className='flex flex-wrap'>
                    {expBoxes}
                </div>
              </div>
            </div>
          </div>
          <div className='kid-character p-3 grow'>
            <div className='kid-details grow border-solid border-2 bg-tan'>
              <div className='kid-header bg-black text-white p-1'>Kid Details</div>
              <div className='flex flex-wrap border-solid border-b-2 py-2'>
                <div className='kid-field grow'>
                  <label htmlFor={'name_' + selectedKid.id} className='inline-block w-20'>Name:</label>
                  <input name={'name_' + selectedKid.id} id={'name_' + selectedKid.id} type='text' defaultValue={selectedKid.name} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'type_' + selectedKid.id} className='inline-block w-20'>Type:</label>
                  <input name={'type_' + selectedKid.id} id={'type_' + selectedKid.id} type='text' defaultValue={selectedKid.type} className='m-1 w-auto md:w-9/12 lg:w-8/12' />
                </div>
              </div>
              <div className='flex flex-wrap border-solid border-b-2 py-2'>
                <div className='kid-field grow'>
                  <label htmlFor={'age_' + selectedKid.id} className='inline-block w-20'>Age:</label>
                  <input name={'age_' + selectedKid.id} id={'age_' + selectedKid.id} type='number' defaultValue={selectedKid.age} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow bg-orange-light align-middle'>
                  <label htmlFor={'luck_' + selectedKid.id} className='inline-block w-20'>Luck Points:</label>
                  <div className='inline-block'>
                    {luckBoxes}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap border-solid border-b-2 py-2'>
                <div className='kid-field grow'>
                  <label htmlFor={'drive_' + selectedKid.id} className='inline-block w-20'>Drive:</label>
                  <input name={'drive_' + selectedKid.id} id={'drive_' + selectedKid.id} type='text' defaultValue={selectedKid.drive} className='m-1 w-auto md:w-9/12' />
                </div>
                <div className='kid-field grow lg:grow-0'>
                  <label htmlFor={'anchor_' + selectedKid.id} className='inline-block w-20'>Anchor:</label>
                  <input name={'anchor_' + selectedKid.id} id={'anchor_' + selectedKid.id} type='text' defaultValue={selectedKid.anchor} className='m-1 w-auto md:w-9/12 lg:w-8/12' />
                </div>
              </div>
              <div className=''>
                <div className='kid-field p-2 border-solid border-b-2'>
                  <p><label htmlFor={'problem_' + selectedKid.id} className=''>Problem:</label></p>
                  <textarea name={'problem_' + selectedKid.id} id={'problem_' + selectedKid.id} className='w-full' defaultValue={selectedKid.problem}></textarea>
                </div>
              </div>
              <div className=''>
                <div className='kid-field p-2 border-solid border-b-2'>
                  <p><label htmlFor={'pride_' + selectedKid.id} className=''>Pride: <span className='float-right'>Checked? <input type='checkbox' name={'prideUsed_' + selectedKid.id} className='float-right' /></span></label></p>
                  <textarea name={'pride_' + selectedKid.id} id={'pride_' + selectedKid.id} className='w-full' defaultValue={selectedKid.pride}></textarea>
                </div>
              </div>
              <div className=''>
                <div className='kid-field p-2'>
                  <p><label htmlFor={'description_' + selectedKid.id} className=''>Description:</label></p>
                  <textarea name={'description_' + selectedKid.id} id={'description_' + selectedKid.id} className='w-full' defaultValue={selectedKid.description}></textarea>
                </div>
              </div>
            </div>
          
            <div className='kid-relationships border-solid border-2 bg-tan'>
              <div className='kid-header bg-black text-white p-1'>Relationships</div>
              {selectedKid.relationships.map((rel,i) => (<Relationship rel={rel} index={i}  />))}
            </div>
            <div className='kid-items border-solid border-2 bg-tan'>
              <div className='kid-header bg-black text-white p-1'>Items</div>
              {itemRows}
            </div>
            <div className='kid-hideout border-solid border-2 bg-tan'>
              <div className='kid-header bg-black text-white p-1'>{ selectedKid.hideout.name }</div>
              {hideoutRows}
            </div>
            <div className='kid-notes border-solid border-2 bg-tan'>
              <div className='kid-header bg-black text-white p-1'>{selectedKid.hideout.name}</div>
              <textarea name={'notes_' + selectedKid.id} defaultValue={selectedKid.notes} className='w-full h-80'></textarea>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
