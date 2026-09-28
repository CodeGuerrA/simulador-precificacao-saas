import { Simulator } from "@/components/Simulator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <main>
        <Simulator />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerTitle}>Grupo e dados</h2>
          <dl className={styles.about}>
            <div>
              <dt>Grupo</dt>
              <dd>Carlos Garcia, Yuri Dourado e Guilherme Rubatto. Engenharia Econômica, Faculdade SENAI FATESG.</dd>
            </div>
            <div>
              <dt>Dados</dt>
              <dd>Fictícios, para simulação. A taxa de tributos é hipotética.</dd>
            </div>
          </dl>
        </div>
      </footer>
    </>
  );
}
