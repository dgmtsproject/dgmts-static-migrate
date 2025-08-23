import './CareerPage.css';
import jobData from './jobData';

const JobOpening = ({ job }) => (
  <div className="job-opening">
    <h2 className="job-title">{job.title}</h2>
    {job.id && <p className="job-id">Job ID#: {job.id}</p>}
    {job.worksite && (
      <>
        <h3>Worksite:</h3>
        <p>{job.worksite}</p>
      </>
    )}
    {job.description && job.description.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}
    {job.responsibilities && (
      <>
        <h3>Responsibilities:</h3>
        <p>{job.responsibilities}</p>
      </>
    )}
    <h3>Requirements:</h3>
    <p>{job.requirements}</p>
    <h3>To Apply:</h3>
    {job.apply.method === 'email' ? (
      <p>Email Resumes: <a href={`mailto:${job.apply.details}`}>{job.apply.details}</a></p>
    ) : (
      <p>{job.apply.details}</p>
    )}
  </div>
);

const CareerPage = () => (
  <div className="career-page">
    <h1 className="career-heading">Careers</h1>
    <p className="career-intro">
      Dulles Geotechnical and Materials Testing Services (DGMTS) is a growing company. We are always seeking talented individuals to join our team.
    </p>

    <div className="job-listings">
      {jobData.map((job, index) => (
        <JobOpening key={index} job={job} />
      ))}
    </div>
  </div>
);

export default CareerPage;
