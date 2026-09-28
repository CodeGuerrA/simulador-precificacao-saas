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
          <h2 className={styles.footerTitle}>De onde vêm as contas</h2>
          <dl className={styles.provenance}>
            <div>
              <dt>Fórmulas</dt>
              <dd>Enunciado da atividade, Opção 2 (p.2), e Aula 4: custo, preço e valor.</dd>
            </div>
            <div>
              <dt>Conferência</dt>
              <dd>Testes automatizados com os resultados de referência do enunciado (p.3 e p.9).</dd>
            </div>
            <div>
              <dt>Dados</dt>
              <dd>Fictícios, para simulação. A taxa de tributos é hipotética.</dd>
            </div>
            <div>
              <dt>Grupo</dt>
              <dd>Carlos Garcia, Yuri Dourado e Guilherme Rubatto. Engenharia Econômica, Faculdade SENAI FATESG.</dd>
            </div>
          </dl>
        </div>
      </footer>
    </>
  );
}
