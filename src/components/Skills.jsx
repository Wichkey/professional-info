import './Skills.css'

const columns = [
  [
    { name: 'Python', level: 95, icon: '/icons/python.png' },
    { name: 'R', level: 80, icon: '/icons/icon-r.svg' },
    { name: 'Fine tuning LLMs', level: 80, icon: '/icons/icon-pytorch.svg' },
    { name: 'SQL', level: 85, icon: '/icons/icon-mysql.svg' },
    { name: 'Training NNs', level: 60, icon: '/icons/icon-pytorch.svg' },
    { name: 'Algorithms', level: 95, icon: '/icons/tree-structure.png' },
  ],
  [
    { name: 'Java', level: 70, icon: '/icons/java.png' },
    { name: 'JavaScript', level: 70, icon: '/icons/icon-javascript.svg' },
    { name: 'HTML', level: 70, icon: '/icons/icon-html5.svg' },
    { name: 'CSS', level: 60, icon: '/icons/icon-css3.svg' },
    { name: 'Figma', level: 50, icon: '/icons/icon-figma.svg' },
  ],
]

const Skill = ({ name, level, icon, delay }) => (
  <div
    className="skill"
    data-reveal
    style={{ '--reveal-delay': `${delay}s`, '--level': `${level}%` }}
  >
    <img className="skill-icon" src={icon} alt="" width="42" height="42" />
    <div className="skill-info">
      <div className="skill-head">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-bar">
        <span className="skill-fill" />
      </div>
    </div>
  </div>
)

const Skills = () => {
  return (
    <section id="skills">
      <h2 className="section-heading skills-heading" data-reveal="left">
        Skills
      </h2>
      <div className="skills-grid">
        {columns.map((column, i) => (
          <div className="skills-column" key={i}>
            {column.map((skill, j) => (
              <Skill key={skill.name} {...skill} delay={j * 0.08} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
