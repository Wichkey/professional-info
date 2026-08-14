import './Projects.css'
import { projects } from '../data/projects'

const ProjectCard = ({ project, index }) => (
  <div className="project-slot" style={{ '--i': index }}>
    <article className="project-card" data-reveal="fade">
      <div className="project-main">
        <p className="project-kicker">
          <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{project.kicker}</span>
        </p>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <ul className="project-tech">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>

      <aside className="project-spec">
        {project.figure && (
          <p className="project-figure">
            <span className="project-figure-value">{project.figure.value}</span>
            <span className="project-figure-label">{project.figure.label}</span>
          </p>
        )}
        <dl className="project-meta">
          <dt>Context</dt>
          <dd>{project.context}</dd>
          <dt>Timeline</dt>
          <dd>{project.timeline}</dd>
        </dl>
      </aside>
    </article>
  </div>
)

const Projects = () => {
  return (
    <section id="projects">
      <h2 className="section-heading projects-heading" data-reveal="left">
        Projects
      </h2>
      <div className="projects-deck">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

export default Projects
