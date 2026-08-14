import './Skills.css'
import pythonIcon from '../assets/icons/python.png'
import rIcon from '../assets/icons/icon-r.svg'
import pytorchIcon from '../assets/icons/icon-pytorch.svg'
import mysqlIcon from '../assets/icons/icon-mysql.svg'
import treeIcon from '../assets/icons/tree-structure.png'
import javaIcon from '../assets/icons/java.png'
import javascriptIcon from '../assets/icons/icon-javascript.svg'
import htmlIcon from '../assets/icons/icon-html5.svg'
import cssIcon from '../assets/icons/icon-css3.svg'
import figmaIcon from '../assets/icons/icon-figma.svg'

const columns = [
  [
    { name: 'Python', level: 95, icon: pythonIcon },
    { name: 'R', level: 80, icon: rIcon },
    { name: 'Fine tuning LLMs', level: 80, icon: pytorchIcon },
    { name: 'SQL', level: 85, icon: mysqlIcon },
    { name: 'Training NNs', level: 60, icon: pytorchIcon },
    { name: 'Algorithms', level: 95, icon: treeIcon },
  ],
  [
    { name: 'Java', level: 70, icon: javaIcon },
    { name: 'JavaScript', level: 70, icon: javascriptIcon },
    { name: 'HTML', level: 70, icon: htmlIcon },
    { name: 'CSS', level: 60, icon: cssIcon },
    { name: 'Figma', level: 50, icon: figmaIcon },
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
