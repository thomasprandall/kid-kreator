import { Navbar } from "./navbar";

const Header = (selectedKid) => {
    return (
        <Navbar props={selectedKid} />
    )
};

const AgeAlert = ({ validAge }) => {
    return (
        <div className={(validAge ? 'hidden' : 'block') + ' box-shadow shadow-lg bg-warning text-white p-1 text-center text-sm'}>Attributes Exceed Age!</div>
    )
}

export { Header, AgeAlert };