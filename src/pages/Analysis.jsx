import { Forbidden, TitledIndicator, Button, SimpleDropDown, SimpleInput, SimpleStatusContainer, MainForm, UAForm } from "../components/mainComponent.jsx";
import VerifyEntry from "../services/validateUserEntry.jsx"
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AllProducts } from "../services/productService.jsx";
import { AllCustomers } from "../services/customerService.jsx";
import { AllCategories } from "../services/categoryService.jsx";
import { AllSales } from "../services/salesService.jsx";
import { AllStocks } from "../services/stockService.jsx";
import { AllWholesalers } from "../services/wholesalerService.jsx";
import { AllWholesalerProductEntries } from "../services/wholesalerProductEntryService.jsx";

function Analysis() {
    const [authStatus, setAuthStatus] = useState(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [wholesalers, setWholesalers] = useState([]);
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [stocks, setStocks] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timed;

        const verifyAndFetch = async () => {
            const result = await VerifyEntry();
            setAuthStatus(result);

            if (result) {
                timed = setTimeout(() => {
                    fetchData();
                }, 1000);
            }
        };

        verifyAndFetch();

        return () => {
            if (timed) clearTimeout(timed);
        };
    }, []);

    const [bestSaleLastWeek, setBestSaleLastWeek] = useState([]);

    const fetchData = async () => {
        setCategories([]);
        setProducts([]);
        setCustomers([]);
        setWholesalers([]);
        setSales([]);
        setPurchases([]);
        setStocks([]);

        setLoading(true);
        try {
            const response = await AllCategories('-', '-');
            if (response.status === 200) {
                const categoryData = response.data.data;
                if (Object.keys(categoryData).length == 0) {
                    setCategories({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(categoryData).length; i++) {
                        const page = Object.keys(categoryData)[i];
                        const pageData = categoryData[page].map(data => ({
                            ...data
                        }));
                        setCategories(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response1 = await AllProducts('-', '-', '-');
            if (response1.status === 200) {
                const productData = response1.data.data;
                if (Object.keys(productData).length == 0) {
                    setProducts({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(productData).length; i++) {
                        const page = Object.keys(productData)[i];
                        const pageData = productData[page].map(data => ({
                            ...data
                        }));
                        setProducts(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response2 = await AllCustomers('-', '-', '-', '-', '-');
            if (response2.status === 200) {
                const customerData = response2.data.data;
                if (Object.keys(customerData).length == 0) {
                    setCustomers({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(customerData).length; i++) {
                        const page = Object.keys(customerData)[i];
                        const pageData = customerData[page].map(data => ({
                            ...data
                        }));
                        setCustomers(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response3 = await AllWholesalers('-', '-', '-', '-', '-');
            if (response3.status === 200) {
                const wholesalerData = response3.data.data;
                if (Object.keys(wholesalerData).length == 0) {
                    setWholesalers({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(wholesalerData).length; i++) {
                        const page = Object.keys(wholesalerData)[i];
                        const pageData = wholesalerData[page].map(data => ({
                            ...data
                        }));
                        setWholesalers(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response4 = await AllSales('-', '-', '-');
            if (response4.status === 200) {
                const salesData = response4.data.data;
                if (Object.keys(salesData).length == 0) {
                    setSales([] );
                } else {
                    for (let i = 0; i < Object.keys(salesData).length; i++) {
                        const page = Object.keys(salesData)[i];
                        const pageData = salesData[page].map(data => ({
                            ...data
                        }));
                        setSales(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response5 = await AllWholesalerProductEntries('-', '-');
            if (response5.status === 200) {
                const purchasesData = response5.data.data;
                if (Object.keys(purchasesData).length == 0) {
                    setPurchases({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(purchasesData).length; i++) {
                        const page = Object.keys(purchasesData)[i];
                        const pageData = purchasesData[page].map(data => ({
                            ...data
                        }));
                        setPurchases(prevState => [...prevState, ...pageData]);
                    }
                }
            }
            const response6 = await AllStocks('-', '-', '-', '-', '-', '-');
            if (response6.status === 200) {
                const stockData = response6.data.data;
                if (Object.keys(stockData).length == 0) {
                    setStocks({ 1: [] });
                } else {
                    for (let i = 0; i < Object.keys(stockData).length; i++) {
                        const page = Object.keys(stockData)[i];
                        const pageData = stockData[page].map(data => ({
                            ...data
                        }));
                        setStocks(prevState => [...prevState, ...pageData]);
                    }
                }

            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const [totalCounts, setTotalCounts] = useState([
        { label: "Total Products", value: 0 },
        { label: "Total Categories", value: 0 },
        { label: "Total Customers", value: 0 },
        { label: "Total Wholesalers", value: 0 },
        { label: "Total Sales", value: 0 },
        { label: "Total Purchases", value: 0 },
    ]);

    function getLastWeekRange() {
        const now = new Date();
        const dayOfWeek = now.getDay();

        const end = new Date(now);
        end.setDate(now.getDate() - dayOfWeek);
        end.setHours(23, 59, 59, 999);

        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        start.setHours(0, 0, 0, 0);

        return { start, end };
    }

    const currentWeekStart = () => {
        const now = new Date();
        const day = now.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const start = new Date(now);
        start.setDate(now.getDate() + diffToMonday);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    };

    const currentMonthStart = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = now;
        return { start, end };
    };

    const currentYearStart = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = now;
        return { start, end };
    };

    const weeklyBarChartData = [
        { day: "Sun", sales: 0 },
        { day: "Mon", sales: 0 },
        { day: "Tue", sales: 0 },
        { day: "Wed", sales: 0 },
        { day: "Thu", sales: 0 },
        { day: "Fri", sales: 0 },
        { day: "Sat", sales: 0 },
    ];

    const [dailyBarChartData, setDailyBarChartData] = useState([]);

    const monthlyBarChartData = [
        { week: "First Week", sales: 0 },
        { week: "Second Week", sales: 0 },
        { week: "Third Week", sales: 0 },
        { week: "Fourth Week", sales: 0 },
    ];

    const yearlyBarChartData = [
        { month: "Jan", sales: 0 },
        { month: "Feb", sales: 0 },
        { month: "Mar", sales: 0 },
        { month: "Apr", sales: 0 },
        { month: "May", sales: 0 },
        { month: "Jun", sales: 0 },
        { month: "Jul", sales: 0 },
        { month: "Aug", sales: 0 },
        { month: "Sep", sales: 0 },
        { month: "Oct", sales: 0 },
        { month: "Nov", sales: 0 },
        { month: "Dec", sales: 0 },
    ];

    useEffect(() => {
        setTotalCounts([
            { label: "Total Products", value: Object.keys(products).length },
            { label: "Total Categories", value: Object.keys(categories).length },
            { label: "Total Customers", value: Object.keys(customers).length },
            { label: "Total Wholesalers", value: Object.keys(wholesalers).length },
            { label: "Total Sales", value: Object.keys(sales).length },
            { label: "Total Purchases", value: Object.keys(purchases).length },
        ]);
        const { start, end } = getLastWeekRange();

        const lastWeekSales = sales.filter(s => {
            const d = new Date(s.purchaseDate);
            return d >= start && d <= end;
        });

        const bestSale = lastWeekSales.map(s => ({
            saleID: s.saleID,
            productName: s.productName,
            categoryName: s.categoryName,
            totalSaleCount: 0,
            totalBill: 0,
            totalUnits: 0
        }));

        for (let i = 0; i < lastWeekSales.length; i++) {
            const sale = bestSale.find(s => s.saleID === lastWeekSales[i].saleID);
            if (sale) {
                sale.totalSaleCount += 1;
                sale.totalBill += parseInt(lastWeekSales[i].totalBill);
                sale.totalUnits += parseInt(lastWeekSales[i].quantity);
            }
        }

        setBestSaleLastWeek(bestSale.sort((a, b) => b.totalUnits - a.totalUnits).filter((p, i) => i < 5).map(p => p));

    }, [products, categories, customers, wholesalers, sales, purchases]);

    const [barCharBy, setBarChartBy] = useState("Select");
    const [barChartTitle, setBarChartTitle] = useState("Select Sales");

    const [barChartData, setBarChartData] = useState(weeklyBarChartData);
    const [barChartAxis, setBarChartAxis] = useState("day");

    useEffect(() => {
        barCharBy === "Day" ? setBarChartData(dailyBarChartData) : barCharBy === "Week" ? setBarChartData(weeklyBarChartData) : barCharBy === "Month" ? setBarChartData(monthlyBarChartData) : barCharBy === "Year" ? setBarChartData(yearlyBarChartData) : setBarChartData([]);
        barCharBy === "Day" ? setBarChartTitle("Todays Sales") : barCharBy === "Week" ? setBarChartTitle("Week Sales") : barCharBy === "Month" ? setBarChartTitle("Month Sales") : barCharBy === "Year" ? setBarChartTitle("Year Sales") : setBarChartTitle("Select Sales");
        barCharBy === "Day" ? setBarChartAxis("item") : barCharBy === "Week" ? setBarChartAxis("day") : barCharBy === "Month" ? setBarChartAxis("week") : barCharBy === "Year" ? setBarChartAxis("month") : setBarChartAxis("item");
        for (let i = 0; i < sales.length; i++) {
            const { start, end } = currentWeekStart();
            let myDate = new Date(sales[i].purchaseDate);
            if (myDate >= start && myDate <= end) {
                switch (myDate.getUTCDay()) {
                    case 0:
                        weeklyBarChartData[0].sales += parseInt(sales[i].totalBill);
                        break;
                    case 1:
                        weeklyBarChartData[1].sales += parseInt(sales[i].totalBill);
                        break;
                    case 2:
                        weeklyBarChartData[2].sales += parseInt(sales[i].totalBill);
                        break;
                    case 3:
                        weeklyBarChartData[3].sales += parseInt(sales[i].totalBill);
                        break;
                    case 4:
                        weeklyBarChartData[4].sales += parseInt(sales[i].totalBill);
                        break;
                    case 5:
                        weeklyBarChartData[5].sales += parseInt(sales[i].totalBill);
                        break;
                    case 6:
                        weeklyBarChartData[6].sales += parseInt(sales[i].totalBill);
                        break;
                }
            }
        }
        for (let i = 0; i < sales.length; i++) {
            const { start, end } = currentMonthStart();
            let myDate = new Date(sales[i].purchaseDate);
            if (myDate >= start && myDate <= end) {
                const weekOfMonth = Math.ceil(myDate.getDate() / 7) - 1;
                monthlyBarChartData[weekOfMonth].sales += parseInt(sales[i].totalBill);
            }
        }
        for (let i = 0; i < sales.length; i++) {
            const { start, end } = currentYearStart();
            let myDate = new Date(sales[i].purchaseDate);
            if (myDate >= start && myDate <= end) {
                const monthOfYear = myDate.getMonth() + 1;
                yearlyBarChartData[monthOfYear - 1].sales += parseInt(sales[i].totalBill);
            }
        }
        setDailyBarChartData([]);
        const myDate = new Date();
        const today = myDate.getDate() + "-" + myDate.getMonth() + "-" + myDate.getFullYear();
        let dailyDataMap = {};

        sales.forEach(sale => {
            const d = new Date(sale.purchaseDate).getDate() + "-" + new Date(sale.purchaseDate).getMonth() + "-" + new Date(sale.purchaseDate).getFullYear();
            if (d === today) {
                const product = sale.productName;
                const bill = Number(sale.totalBill);
                dailyDataMap[product] = (dailyDataMap[product] || 0) + bill;
            }
        });

        const dailyData = Object.entries(dailyDataMap).map(([item, sales]) => ({
            item,
            sales,
        }));
        console.log(dailyData);
        setDailyBarChartData(dailyData);

    }, [barCharBy]);

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
        <div
            style={{
                height: "85vh",
                backgroundColor: "#1c1c1c",
                borderRadius: "10px",
                padding: "0 15px 15px 15px",
                boxShadow: "1px 1px 2px #77777750",
                color: "white",
                overflowX: "scroll",
                scrollBehavior: "smooth",
            }} className="hide-scrollbar">
            <h2 onClick={() => currentWeekStart()} className="p-2 mb-3 w-100" style={{ position: "fixed", backgroundColor: "#1c1c1c" }}>Analysis Report</h2>
            <div id="total" className="d-flex flex-row gap-2 justify-content-between">
                {
                    totalCounts.map((section, index) => <>
                        <div style={
                            {
                                marginTop: "60px",
                                height: "80px",
                                backgroundColor: "#101010",
                                borderRadius: "10px",
                                color: "#acacacff",

                                padding: "15px",
                                boxShadow: "1px 1px 2px #77777750",
                            }} className="d-flex flex-row align-items-center  justify-content-center">
                            <p className="p-0 m-0" style={{ flex: 3, fontSize: "18px", fontWeight: "bold" }}>{section.label}</p>
                            <p className="p-0 m-0" style={{ flex: 1, fontSize: "22px" }}>{section.value}</p>
                        </div>
                    </>)
                }
            </div>
            <div style={window.innerWidth <= 450? { height: "250px", flexDirection : "column"} : { height: "250px", flexDirection : "row"}} className="mt-2 d-flex align-items-start gap-2 justify-content-start">
                <div style={
                    {
                        height: "100%",
                        backgroundColor: "#101010",
                        borderRadius: "10px",
                        color: "white",
                        padding: "15px",
                        overflowX: "scroll",
                        scrollBehavior: "smooth",
                        boxShadow: "1px 1px 2px #77777750",
                        color: "#acacacff",
                        flex: 1,
                    }} className="d-flex flex-column hide-scrollbar align-items-start gap-2 justify-content-start">
                    <h5>Stock Running Out</h5>
                    <div className="w-100">
                        <table className="w-100" style={{ color: "white" }}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Wholesaler</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            {
                                stocks.sort((a, b) => a.stock - b.stock).filter(s => s.stock < 5).map((s, i) =>
                                    <tbody>
                                        <tr key={i + 1}>
                                            <td>{s.productName}</td>
                                            <td>{s.wholesalerName}</td>
                                            <td>{s.stock}</td>
                                        </tr>
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
                <div style={
                    {
                        height: "100%",
                        flex: 1,
                    }} className="d-flex flex-column gap-2">
                    <div style={
                        {
                            width: "100%",
                            backgroundColor: "#101010",
                            borderRadius: "10px",
                            color: "white",
                            padding: "8px",
                            overflowX: "scroll",
                            scrollBehavior: "smooth",
                            boxShadow: "1px 1px 2px #77777750",
                            color: "#acacacff",
                            flex: 1
                        }} className="d-flex flex-column hide-scrollbar align-items-start gap-2 justify-content-start">
                        <h6 className="m-0 p-0">Recent Sale</h6>
                        <div className="w-100">
                            <table className="w-100" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Total Cost</th>
                                    </tr>
                                </thead>
                                {
                                    sales.sort((a, b) => b.saleID - a.saleID).map((s, i) =>
                                        <tbody>
                                            <tr key={i + 1}>
                                                <td>{s.customerName}</td>
                                                <td>{s.productName}</td>
                                                <td>₹{s.totalBill}</td>
                                            </tr>
                                        </tbody>
                                    )
                                }
                            </table>
                        </div>
                    </div>
                    <div style={
                        {
                            width: "100%",
                            backgroundColor: "#101010",
                            borderRadius: "10px",
                            color: "white",
                            padding: "8px",
                            overflowX: "scroll",
                            scrollBehavior: "smooth",
                            boxShadow: "1px 1px 2px #77777750",
                            color: "#acacacff",
                            flex: 1
                        }} className="d-flex flex-column hide-scrollbar align-items-start gap-2 justify-content-start">
                        <h6 className="m-0 p-0">Recent Purchase</h6>
                        <table className="w-100" style={{ color: "white" }}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Wholesaler</th>
                                    <th>Total Cost</th>
                                </tr>
                            </thead>
                            {
                                purchases.sort((a, b) => b.wholesalerProductID - a.wholesalerProductID).map((s, i) =>
                                    <tbody>
                                        <tr key={i + 1}>
                                            <td>{s.productName}</td>
                                            <td>{s.wholesalerName}</td>
                                            <td>₹{s.totalCost}</td>
                                        </tr>
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
            </div>
            <div style={{ height: "220px", }} className="mt-2 d-flex flex-row align-items-start gap-2 justify-content-start">
                <div style={
                    {
                        height: "100%",
                        backgroundColor: "#101010",
                        borderRadius: "10px",
                        color: "white",
                        padding: "15px",
                        overflowX: "scroll",
                        scrollBehavior: "smooth",
                        boxShadow: "1px 1px 2px #77777750",
                        color: "#acacacff",
                        flex: 1.5
                    }} className="d-flex flex-column hide-scrollbar align-items-start gap-1 justify-content-start">
                    <h5>Best Sale Last Week</h5>
                    <table className="w-100" style={{ color: "white" }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Times Sold</th>
                                <th>Total Units</th>
                                <th>Total Sale</th>
                            </tr>
                        </thead>
                        {
                            bestSaleLastWeek.map((s, i) =>
                                <tbody>
                                    <tr key={i + 1}>
                                        <td>{s.productName}</td>
                                        <td>{s.totalSaleCount}</td>
                                        <td>{s.totalUnits}</td>
                                        <td>₹{s.totalBill}</td>
                                    </tr>
                                </tbody>
                            )
                        }
                    </table>
                </div>
            </div>
            <div id="week-sale" style={
                {
                    height: "450px",
                    backgroundColor: "#101010",
                    borderRadius: "10px",
                    color: "white",
                    padding: "15px",
                    boxShadow: "1px 1px 2px #77777750",
                    color: "#acacacff",
                }} className="mt-2 d-flex flex-column align-items-start gap-2 justify-content-start">
                <div className="w-100 d-flex flex-row justify-content-between align-items-center">
                    <h5>{barChartTitle}</h5>
                    <SimpleDropDown Title="Select" Options={[
                        {
                            key: "Day",
                            value: "Day",
                        },
                        {
                            key: "Week",
                            value: "Week",
                        },
                        {
                            key: "Month",
                            value: "Month",
                        },
                        {
                            key: "Year",
                            value: "Year",
                        }
                    ]} BGColor="#101010" BSColor="#77777750" BRR="10" Color="white" BRColor="#77777750" H="40" CallBack={(val) => setBarChartBy(val)} />
                </div>
                <ResponsiveContainer width="100%" height="90%">
                    {
                        barCharBy === "Day" ?
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={dailyBarChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey={barChartAxis} stroke="#aaa" />
                                    <YAxis stroke="#aaa" />
                                    <Tooltip
                                        cursor={{ fill: "rgba(255,255,255,0.1)" }}
                                        contentStyle={{ background: "#222", border: "none", color: "white" }}
                                    />
                                    <Bar
                                        dataKey="sales"
                                        fill="#00bcd4"
                                        activeBar={{ stroke: "black", strokeWidth: 2 }}
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                            : <LineChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey={barChartAxis} stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip contentStyle={{ background: "#222", border: "none" }} />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#00bcd4"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#00bcd4" }}
                                />
                            </LineChart>
                    }
                </ResponsiveContainer>
            </div>
        </div>
    </>
}

export default Analysis;