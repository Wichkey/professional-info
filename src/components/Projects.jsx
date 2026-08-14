import './Projects.css'

const projects = [
  {
    title: 'Voice-Controlled UI with LLM Integration',
    description:
      'Developed a speech-based interface combining Whisper and a fine-tuned LLM to detect and execute voice commands in context. Focused on command parsing, dataset generation, model fine-tuning, and optimizing speed and GPU usage.',
    align: 'left',
  },
  {
    title: 'Nutrition app',
    description:
      'Fully custom-built app that creates personalized meal plans and weekly grocery lists based on user goals and preferences—developed entirely without coding templates.',
    align: 'right',
  },
]

const ProjectCard = ({ title, description, align }) => (
  <div className={`project-row project-row-${align}`}>
    <div className="project-card">
      <div className="project-card-face project-card-front">
        <h3>{title}</h3>
      </div>
      <div className="project-card-face project-card-back">
        <p>{description}</p>
      </div>
    </div>
    <span className="project-wip">work in progress</span>
  </div>
)

const Projects = () => {
  return (
    <section id="projects">
      <h2 className="section-heading projects-heading">Example projects</h2>
      {projects.map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </section>
  )
}

export default Projects
