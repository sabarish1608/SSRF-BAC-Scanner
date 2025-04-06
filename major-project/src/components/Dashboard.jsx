import React from 'react';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = ({ location }) => {
  const { ssrf, brokenAccessControl } = location.state.data;

  const data = {
    labels: ['SSRF', 'Broken Access Control'],
    datasets: [
      {
        label: 'Vulnerability Percentage',
        data: [ssrf, brokenAccessControl],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const downloadReport = () => {
    const input = document.getElementById('dashboard');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('report.pdf');
    });
  };

  return (
    <div id="dashboard" className="dashboard-container">
      <h1>Vulnerability Dashboard</h1>
      <div className="chart-container">
        <Bar data={data} />
      </div>
      <button onClick={downloadReport}>Download Report</button>
    </div>
  );
};

export default Dashboard;