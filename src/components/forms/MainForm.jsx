import { SimpleInput, Button } from "../mainComponent";
function MainForm({ Title, SearchHint, ButtonTitle, Filters, Columns, Data, DataFields, Page, Update, Delete, Add, Search, SetSearch }) {
    return <>
        <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        <div style={
            {
                height : "85vh",
                border: "1px solid #77777750",
                backgroundColor: "#1c1c1c",
                borderRadius: "10px",
                color: "white",
                overflowY: "auto",
                overflowX: "hidden",
                padding : "0 15px 15px 15px"
            }
        } className="d-flex flex-column hide-scrollbar">
            <h2 className="p-2 mb-3 w-100"  style={{ position: "fixed", backgroundColor: "#1c1c1c" }}>{Title}</h2>
            <div className="d-flex flex-row align-items-center gap-2" style={{marginTop: "60px"}}>
                <div style={{ flex: "8"}}>
                    <SimpleInput Text={SearchHint} BGColor="#0f0f0f" BSColor="#77777750" BRR="10" H="50" BRColor="#77777750" Color="white" Type="text" Value={Search == '-' ? "" : Search} CallBack={SetSearch} Disabled={false} />
                </div>
                <div style={{ flex: "2" }}>
                    <Button Title={ButtonTitle} Color="white" BGColor="#0f0f0f" BRColor="10" OnClick={Add} />
                </div>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-between p-2 gap-2">
                <div className="gap-2 d-flex flex-row align-items-center">
                    <p className="m-0 p-0">Filters</p>
                    {
                        Filters.map(filter => filter)
                    }
                </div>
                <div className="d-flex flex-row gap-2">
                    <Button Title="Prev" Color="white" BGColor="transparent" BRColor="#77777750" OnClick={() => Page(-1)} />
                    <Button Title="Next" Color="white" BGColor="transparent" BRColor="#77777750" OnClick={() => Page(1)} />
                </div>
            </div>
            <div className="p-2" style={{ backgroundColor: "#0f0f0f", border: "1px solid #77777750" }}>
                <table className="table" style={{ backgroundColor: "#0f0f0f", color: "white" }}>
                    <thead style={{ background: "#0f0f0f" }}>
                        <tr>
                            {
                                Columns[1].map(column => <th scope="col" style={{ background: "#0f0f0f", color: "white" }}>{column}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Data[0].map((row, index) => <>
                                <tr>
                                    <th style={{ background: "#0f0f0f", color: "white" }} scope="row">{index + 1}</th>
                                    {
                                        DataFields.map((field) => <td style={{ background: "#0f0f0f", color: "white" }} >{field.toLowerCase().includes("date") ? new Date(row[field]).toLocaleDateString("en-GB") : row[field]}</td>)
                                    }
                                    <td style={{ background: "#0f0f0f", color: "white" }} >
                                        <Button Title="Update" Color="#e0a800" BGColor="transparent" BRColor="#e0a800" OnClick={() => Update(row)} />
                                    </td>
                                    <td style={{ background: "#0f0f0f", color: "white" }} >
                                        <Button Title="Delete" Color="#c82333" BGColor="transparent" BRColor="#c82333" OnClick={() => Delete(row[Columns[0]])} />
                                    </td>
                                </tr>
                            </>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </>
}

export default MainForm;