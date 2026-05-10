import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeamGrid.css';
import { teamMembers } from '../TeamMemberPage/teamData.js';
import MeetTheTeam from './MeetTheTeam';
import { supabase } from '../../supabaseClient';
import { ABOUT_EMPLOYEE_DEPARTMENTS } from '../../constants/aboutTeamDepartments';

const TeamGrid = () => {
  const president = teamMembers.find(member => member.role === 'President');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to extract employee name from filename
  const getEmployeeName = (filename) => {
    // Remove file extension
    return filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '');
  };

  // Import all images from the three folders (lazy loading)
  const managementImages = import.meta.glob('../../assets/employees-pictures/Management & Support Team/*');
  const engineersImages = import.meta.glob('../../assets/employees-pictures/Engineers, Inspectors and Techicians Team/*');
  const itImages = import.meta.glob('../../assets/employees-pictures/IT & Digital Solution Team/*');

  useEffect(() => {
    const loadBundledFolders = async () => {
      const processImages = async (images, department) => {
        const imagePromises = Object.keys(images).map(async (path) => {
          const filename = path.split('/').pop();
          const imageModule = await images[path]();
          return {
            name: getEmployeeName(filename),
            image: imageModule.default,
            department
          };
        });
        return Promise.all(imagePromises);
      };

      const [managementEmployees, engineersEmployees, itEmployees] = await Promise.all([
        processImages(managementImages, 'Management & Support Team'),
        processImages(engineersImages, 'Engineers, Inspectors and Technicians Team'),
        processImages(itImages, 'IT & Digital Solution Team')
      ]);

      const allEmployees = [
        ...managementEmployees,
        ...engineersEmployees,
        ...itEmployees
      ].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
      );

      setEmployees(allEmployees);
      setLoading(false);
    };

    const loadFromApi = async () => {
      try {
        const { data, error } = await supabase
          .from('about_employees')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (error || !data?.length) {
          await loadBundledFolders();
          return;
        }

        setEmployees(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            image: row.image_url,
            department: row.department
          }))
        );
      } catch {
        await loadBundledFolders();
        return;
      }
      setLoading(false);
    };

    const run = async () => {
      setLoading(true);
      await loadFromApi();
    };

    run();
  }, []);

  // Group employees by department
  const groupedEmployees = useMemo(() => {
    const groups = {};
    employees.forEach(emp => {
      if (!groups[emp.department]) {
        groups[emp.department] = [];
      }
      groups[emp.department].push(emp);
    });

    Object.keys(groups).forEach((dept) => {
      groups[dept].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
      );
    });

    return groups;
  }, [employees]);

  const departmentOrder = ABOUT_EMPLOYEE_DEPARTMENTS;

  return (
    <section className="team-grid-section">
      <div className="team-grid-container">
        {/* President Section */}
        <div className="president-header">
          <h2 className="president-title">Meet Our President</h2>
          <p className="president-subtitle">
            Introducing our esteemed leader who founded Dulles Geotechnical and Materials Testing Services.
          </p>
        </div>
        
        <Link to={`/team/${president.id}`} className="president-card">
          <div 
            className="president-image"
            style={{
              backgroundImage: `url(${president.imageUrl})`,
            }}
          />
          
          <div className="president-content">
            <h3 className="president-name">{president.name}</h3>
            <p className="president-role">{president.role}</p>
            {/*<p className="president-degree">{president.degree}</p>
            */ }
            <p className="president-bio">{president.bio}</p>
            
            {/* <div className="president-tags">
              {president.tags.map((tag, idx) => (
                <span key={idx} className="president-tag">
                  {tag}
                </span>
              ))}
            </div> */}
            
            <span className="visit-profile-link">View Full Profile &rarr;</span>
          </div>
        </Link>

        {/* Team Carousel Section */}
        <MeetTheTeam />

        {/* Team Members Section */}
        <div className="team-grid-header">
          <h2 className="team-grid-title">Our Team Members</h2>
          <p className="team-grid-subtitle">
            Meet the dedicated professionals who make our success possible
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading team members...</p>
          </div>
        ) : (
          <>
            {departmentOrder.map(dept => (
              groupedEmployees[dept] && groupedEmployees[dept].length > 0 && (
                <div key={dept} className="department-section">
                  <h3 className="department-heading">{dept}</h3>
                  <div className="employees-grid">
                    {groupedEmployees[dept].map((employee, index) => (
                      <div 
                        key={employee.id ?? `${dept}-${employee.name}-${index}`} 
                        className="employee-card"
                        style={{ animationDelay: `${(index % 20) * 50}ms` }}
                      >
                        <div 
                          className="employee-image"
                          style={{
                            backgroundImage: `url(${employee.image})`,
                          }}
                        >
                          <div className="employee-overlay">
                            <h3 className="employee-name">{employee.name}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default TeamGrid;
