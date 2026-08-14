import './Qualifications.css'

const GradeBox = ({ rows }) => (
  <div className="grade-box">
    <span className="grade-label">final grade</span>
    <dl className="grade-rows">
      {rows.map(([region, grade]) => (
        <div key={region}>
          <dt>{region}</dt>
          <dd>{grade}</dd>
        </div>
      ))}
    </dl>
  </div>
)

const entries = [
  {
    years: '2021-2024',
    title: 'Bachelor of cognitive science',
    institution: 'Eberhard Karls University of Tübingen',
    grades: [
      ['Ger', '1.7'],
      ['USA', '3.3/4.0'],
    ],
    thesis: {
      title: 'Bachelor thesis',
      description:
        'Conducted an experiment in the field of creative writing, specifically examining how AI writing tools, such as ChatGPT, influence the process of ideation.',
      grades: [
        ['Ger', '1.3'],
        ['USA', '3.8/4.0'],
      ],
    },
  },
  {
    years: '2025-2026',
    title: 'Master in AI for Business',
    institution: 'EADA business school',
    grades: [
      ['Ger', '1.1'],
      ['Esp', '9.3/10'],
      ['USA', '4.0/4.0'],
    ],
    thesis: {
      title: 'Master thesis',
      description:
        'Built an interpretable machine-learning pipeline to detect money-mule accounts at a Spanish digital bank, with drift-triggered retraining under human compliance review.',
      grades: [
        ['Ger', '1.0'],
        ['Esp', '10/10'],
        ['USA', '4.0/4.0'],
      ],
    },
  },
]

const Qualifications = () => {
  return (
    <section id="qualifications">
      <h2 className="section-heading about-heading" id="about" data-reveal="left">
        About me
      </h2>
      <h2 className="section-heading qualifications-heading" data-reveal="left">
        Qualifications
      </h2>

      {entries.map((entry) => (
        <article className="qual-entry" key={entry.title} data-reveal>
          <span className="rail-marker" aria-hidden="true" />
          <span className="entry-year">{entry.years}</span>
          <h3 className="entry-title">{entry.title}</h3>
          <p className="entry-institution">
            <span className="entry-dash" />
            {entry.institution}
          </p>
          <div className="entry-body">
            <GradeBox rows={entry.grades} />
            <div className="thesis">
              <h4>{entry.thesis.title}</h4>
              <p>{entry.thesis.description}</p>
              <GradeBox rows={entry.thesis.grades} />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default Qualifications
