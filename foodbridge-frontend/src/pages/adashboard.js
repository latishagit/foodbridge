import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ADashboard = () => {
		const [username,setUsername]=useState('');
    const [tables, setTables] = useState([]);
     const [newRecord, setNewRecord] = useState('');
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
     const [selectedTable, setSelectedTable] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            const user = getUserFromLocalStorage();
            console.log("Retrieved user:", user); 
            setUsername(user.name);
           
            if (user && user.id) {
                try {
                    const response = await api.post('/tables.php');
                    console.log("Response:",response.data);
                    setTables(response.data.tables || []);
                } catch (error) {
                    console.error("Error fetching tables:", error);
                }
                setIsLoading(false);
            } else {
                console.log("No user found. Redirecting to login.");
                navigate('/login');
            }
        };

        fetchTables();
    }, [navigate]);

	 const displayTable = async (table) => {
    setSelectedTable(table);
    try {
        const response = await api.post('/fetchTable.php', { table_name: table });

        console.log("API Response:", response.data); 

        if (response.data.success && response.data.tabledata.length > 0) {
            setTableData(response.data.tabledata);
        } else {
            console.log("No data found for table:", table);
            setTableData([]); 
        }
    } catch (error) {
        console.log("Error fetching table data:", error);
        setTableData([]);
    }
};

	const addRecord = async (e) => {
     e.preventDefault();
    try {
        const response = await api.post('/insert.php', { table_name: selectedTable, record_data:newRecord });

        console.log("API Response:", response.data); 

        if (response.data.success) {
            console.log("Record insert API success");
            displayTable(selectedTable);
        } else {
            console.log("No data found for table:");

        }
    } catch (error) {
        console.log("Error in API:", error);
    
    }
};

	
	
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
        	 <div className="d-flex">
        	 <div className="w-20 border p-2">
        		<h3>All Tables</h3>
        		<ul style={{listStyleType:'none'}}>
        			{tables.map((table,index)=>
    					(
    					<>
    						<li key={index} onClick={() => displayTable(table)}  style={{ cursor: 'pointer' }}>{table}</li>
    						<hr />
    						</>
    					))
        			}
        		</ul>
        		  </div>
        		    <div className="w-85 border p-3">
        		    
        		    <h5>Table Data: {selectedTable || "Select a Table"}</h5>
                    {tableData.length > 0 ? (
                    
                        <table className="table table-responsive table-bordered">
                            <thead>
                                <tr>
                                    {Object.keys(tableData[0]).map((column, index) => (
                                        <th key={index}>{column}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((value, colIndex) => (
                                            <td key={colIndex}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       
                    ) : (
                        <p>No data available for this table.</p>
                    )}
                    <div className="mt-4">
                     <form onSubmit={addRecord}>
                    <h3>Add Record</h3>
                    <select className="form-control">
                    	{tables.map((table,index)=>
    					(
    					<>
    						<option key={index} onClick={() => displayTable(table)}  style={{ cursor: 'pointer' }}>{table}</option>
    						<hr />
    						</>
    					))
        			}
					</select><br/>
                   
                    	<input type="text"
                    	placeholder="Enter comma separated values for record"
						value={newRecord}
						onChange={(e)=>setNewRecord(e.target.value)}
						className="form-control"
						/>
						 <button type="submit" className="btn btn-primary mt-2">Add Record</button>
                    </form>
                    </div>
                    
                    
        		    </div>
        	</div>
         </div>
    );
};

export default ADashboard;

