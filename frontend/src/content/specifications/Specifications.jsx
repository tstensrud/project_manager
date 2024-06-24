import SubTitleComponent from '../../layout/SubTitleComponent';
import Table from '../../tables/Table';

function Specifications() {
    
    const titles = [{text: "Tittel 1"}, {text: "Tittel 2"}, {text: "Tittel 3"}, {text: "Tittel 4"}];
    const row1 = [{text: "Tittel 9"}, {text: "Tittel 9"}, {text: "Tittel 9"}, {text: "Tittel 9"}];
    const row2 = [{text: "Tittel 7"}, {text: "Tittel 7"}, {text: "Tittel 7"}, {text: "Tittel 7"}];
    const rows = [row1, row2];

    return (
        <>
        <SubTitleComponent>
            Kravspesifikasjon 
        </SubTitleComponent>
        <Table headers={titles} rows={rows} />
        </>
    );
}

export default Specifications;