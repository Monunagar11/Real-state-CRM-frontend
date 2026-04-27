import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RealEstateDashboard = () => {
    // Chart configurations
    const propertiesTypeOptions = {
        chart: { type: 'radialBar', height: 350 },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: { background: "#e7e7e7", strokeWidth: '97%', margin: 5 },
                dataLabels: {
                    name: { show: false },
                    value: { offsetY: -2, fontSize: '22px', fontWeight: 'bold' }
                }
            }
        },
        fill: { type: 'gradient', gradient: { shade: 'light', shadeIntensity: 0.4, inverseColors: false, opacityFrom: 1, opacityTo: 1, stops: [0, 50, 53, 91] } },
        labels: ['Average Results'],
        colors: ['#4b38b3'],
    };

    const propertiesTypeSeries = [76];

    const revenueOptions = {
        chart: { type: 'bar', height: 350, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '40%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
        fill: { opacity: 1 },
        colors: ['#38b3a0', '#4b38b3'],
    };

    const revenueSeries = [
        { name: 'Income', data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70] },
        { name: 'Rent', data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 100] }
    ];

    const radialMiniOptions1 = {
        chart: { type: 'radialBar', width: 60, height: 60, sparkline: { enabled: true } },
        plotOptions: { radialBar: { hollow: { margin: 0, size: '50%' }, track: { margin: 0 }, dataLabels: { show: false } } },
        colors: ['#4b38b3']
    };

    return (
        <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold ">Real Estate</h4>
                    <span className="text-muted">Dashboard / Real Estate</span>
                </div>
                <button className="btn btn-primary shadow-sm"><i className="bi bi-plus-circle me-1"></i> Add Property</button>
            </div>

            {/* Top Cards */}
            <div className="row g-4 mb-4">
                {[
                    { title: "Properties for sale", value: "3,652", trend: "up", percent: "06.19%", icon: "bi-house", color: "primary", series: [80] },
                    { title: "Properties for rent", value: "1,524", trend: "up", percent: "02.33%", icon: "bi-building", color: "success", series: [65] },
                    { title: "Visitors", value: "14.9k", trend: "down", percent: "01.12%", icon: "bi-people", color: "warning", series: [45] },
                    { title: "Residency Property", value: "2,364", trend: "up", percent: "04.80%", icon: "bi-buildings", color: "info", series: [70] }
                ].map((item, index) => (
                    <div key={index} className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 rounded-3">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className={`flex-shrink-0 text-${item.color} bg-${item.color} bg-opacity-10 rounded p-2`} style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className={`bi ${item.icon} fs-4`}></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="text-muted mb-1 fs-sm">{item.title}</h6>
                                        <h4 className="mb-0 fw-bold">{item.value}</h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <ReactApexChart options={{...radialMiniOptions1, colors: [`var(--bs-${item.color})`]}} series={item.series} type="radialBar" height={60} width={60} />
                                    </div>
                                </div>
                                <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                                    <span className={`text-${item.trend === 'up' ? 'success' : 'danger'} fw-semibold me-1`}>
                                        <i className={`bi bi-arrow-${item.trend}-circle me-1`}></i>{item.percent}
                                    </span>
                                    vs last month
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section */}
            <div className="row g-4 mb-4">
                <div className="col-xl-9">
                    <div className="card border-0 shadow-sm h-100 rounded-3">
                        <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center pt-4 pb-0">
                            <h5 className="mb-0 fw-bold">Revenue Overview</h5>
                            <div>
                                <button className="btn btn-sm btn-primary me-1 px-3">ALL</button>
                                <button className="btn btn-sm btn-light text-muted me-1 px-3">1M</button>
                                <button className="btn btn-sm btn-light text-muted me-1 px-3">6M</button>
                                <button className="btn btn-sm btn-light text-muted px-3">1Y</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <ReactApexChart options={revenueOptions} series={revenueSeries} type="bar" height={350} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-3">
                    <div className="card border-0 shadow-sm h-100 rounded-3">
                        <div className="card-header border-bottom-0 pt-4 pb-0">
                            <h5 className="mb-0 fw-bold">Properties Type</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <ReactApexChart options={propertiesTypeOptions} series={propertiesTypeSeries} type="radialBar" height={250} />
                            <div className="mt-3 px-3">
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-muted"><i className="bi bi-circle-fill text-primary me-2" style={{fontSize: "10px"}}></i> Commercial</span>
                                    <span className="fw-bold ">45%</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-muted"><i className="bi bi-circle-fill text-success me-2" style={{fontSize: "10px"}}></i> Residential</span>
                                    <span className="fw-bold ">35%</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-circle-fill text-warning me-2" style={{fontSize: "10px"}}></i> Villa</span>
                                    <span className="fw-bold ">20%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="row g-4">
                <div className="col-xl-9">
                    <div className="card border-0 shadow-sm h-100 rounded-3">
                        <div className="card-header d-flex justify-content-between align-items-center pt-4 pb-3 border-bottom">
                            <h5 className="mb-0 fw-bold">Recently Added Property</h5>
                            <button className="btn btn-sm btn-light text-primary fw-semibold px-3">View All</button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light text-muted">
                                        <tr>
                                            <th className="ps-4">#</th>
                                            <th>Property Name</th>
                                            <th>Location</th>
                                            <th>Agent</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th className="pe-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: "#STX01", name: "Villa With Swimming Pool", loc: "New York, USA", agent: "Diana Jones", price: "$2,451.20", status: "Sale", color: "danger" },
                                            { id: "#STX02", name: "Luxury Apartment", loc: "Los Angeles, USA", agent: "James Smith", price: "$3,100.00", status: "Rent", color: "info" },
                                            { id: "#STX03", name: "Modern House", loc: "Chicago, USA", agent: "William Doe", price: "$1,850.00", status: "Sale", color: "danger" },
                                            { id: "#STX04", name: "Studio Apartment", loc: "Miami, USA", agent: "Alice Johnson", price: "$950.00", status: "Rent", color: "info" }
                                        ].map((prop, i) => (
                                            <tr key={i}>
                                                <td className="ps-4"><a href="#!" className="text-primary fw-semibold">{prop.id}</a></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-sm bg-light rounded d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px"}}>
                                                                <i className="bi bi-house text-primary fs-4"></i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0 fw-semibold ">{prop.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted">{prop.loc}</td>
                                                <td>{prop.agent}</td>
                                                <td className="fw-semibold ">{prop.price}</td>
                                                <td><span className={`badge bg-${prop.color} bg-opacity-10 text-${prop.color} px-2 py-1 rounded`}>{prop.status}</span></td>
                                                <td className="pe-4">
                                                    <button className="btn btn-sm btn-light btn-icon me-2 text-secondary"><i className="bi bi-eye"></i></button>
                                                    <button className="btn btn-sm btn-light btn-icon text-secondary"><i className="bi bi-pencil"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3">
                    <div className="card border-0 shadow-sm h-100 rounded-3">
                        <div className="card-header d-flex justify-content-between align-items-center pt-4 pb-3 border-bottom">
                            <h5 className="mb-0 fw-bold">Customer Feedback</h5>
                            <a href="#!" className="text-primary fw-semibold" style={{textDecoration: 'none'}}>View All <i className="bi bi-arrow-right"></i></a>
                        </div>
                        <div className="card-body p-0" style={{maxHeight: "450px", overflowY: "auto"}}>
                            {[
                                { name: "Josefa Weissnat", time: "04:47 PM", comment: "Themebrand used AnyDesk to fix the bug in Flask and django version. I highly recommend this product!" },
                                { name: "Ophelia Steuber", time: "11:24 AM", comment: "Thank you for this awesome admin panel. I'm very happy with it, it's a pleasure to work with it!" },
                                { name: "Dianna Bogan", time: "03:19 PM", comment: "High theme quality. Very good support, they spent almost an hour remotely to fix a problem." }
                            ].map((fb, i) => (
                                <div key={i} className="p-4 border-bottom">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center fw-bold fs-5" style={{width: "40px", height: "40px"}}>
                                                {fb.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h6 className="mb-0 fw-semibold ">{fb.name}</h6>
                                                <small className="text-muted">{fb.time}</small>
                                            </div>
                                            <div className="text-warning mb-2" style={{fontSize: "12px"}}>
                                                <i className="bi bi-star-fill me-1"></i>
                                                <i className="bi bi-star-fill me-1"></i>
                                                <i className="bi bi-star-fill me-1"></i>
                                                <i className="bi bi-star-fill me-1"></i>
                                                <i className="bi bi-star-fill"></i>
                                            </div>
                                            <p className="text-muted mb-0" style={{fontSize: "14px", lineHeight: "1.6"}}>"{fb.comment}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstateDashboard;
