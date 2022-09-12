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

const Relationship = (props) => (
    <div className='p-3'>
        <input type='text' name="relationship_kid" value={props.selectedKid.relationships[props.row]?.kid} className='sm:block sm:w-full sm:mb-1 md:inline md:w-1/5 mr-1' onChange={(evt) => props.updateRelationship(props.row, 'kid', evt.target.value)} />
        <input type='text' name="relationship_relationship" value={props.selectedKid.relationships[props.row]?.relationship} className='sm:block sm:w-full md:inline md:w-3/4 mr-1' onChange={(evt) => props.updateRelationship(props.row, 'relationship', evt.target.value)} />
        <button onClick={() => props.deleteRelationship(props.row)}>X</button>
    </div>
)

export { HideoutDetail, Item, Relationship };