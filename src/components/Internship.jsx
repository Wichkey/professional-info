import './Internship.css'

const tasks = [
  'Developed and integrated a voice-command system',
  'Trained neuronal networks (NNs)',
  'Fine-tuned various large language models (LLMs)',
]

const Internship = () => {
  return (
    <section id="internship">
      <h2 className="section-heading internship-heading" data-reveal="left">
        Internship
      </h2>
      <article className="intern-entry" data-reveal>
        <span className="rail-marker intern-marker" aria-hidden="true" />
        <span className="entry-year">2025</span>
        <h3 className="entry-title">medPhoton GmbH</h3>
        <p className="entry-institution">
          <span className="entry-dash" />
          Salzburg, Austria
        </p>
        <ul className="intern-tasks">
          {tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

export default Internship
