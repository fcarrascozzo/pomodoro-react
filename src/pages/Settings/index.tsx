import { SaveIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";
import { useEffect, useRef } from "react";
import { useTaskContext } from "../../contexts/TaskContext/useTaskState";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";

export function Settings() {
  useEffect(() => {
    document.title = "Configurações - Chronos Pomodoro";
  }, []);

  const { state, dispatch } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    const formErrors = validateSettings(
      workTime,
      shortBreakTime,
      longBreakTime
    );

    if (formErrors.length > 0) {
      formErrors.forEach(showMessage.error);
      return;
    }

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });
    showMessage.success("Configurações Salvas!");
  }

  function validateSettings(
    workTime: number,
    shortBreakTime: number,
    longBreakTime: number
  ): string[] {
    const errors = [];

    if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      errors.push("Digite apenas números para todos os campos!");
      return errors;
    }

    if (workTime < 1 || workTime > 60) {
      errors.push("Digite valores entre 1 e 60 para foco!");
    }

    if (shortBreakTime < 1 || shortBreakTime > 10) {
      errors.push("Digite valores entre 1 e 10 para descanso curto!");
    }

    if (longBreakTime < 1 || longBreakTime > 30) {
      errors.push("Digite valores entre 1 e 30 para descanso longo!");
    }

    if (workTime <= shortBreakTime) {
      errors.push("O tempo de foco deve ser maior que o descanso curto");
    }

    if (workTime <= longBreakTime) {
      errors.push("O tempo de foco deve ser maior que o descanso longo");
    }

    if (shortBreakTime > longBreakTime) {
      errors.push("O descanso curto deve ser menor que o descanso longo");
    }

    return errors;
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>Configurações</Heading>
      </Container>

      <Container>
        <p style={{ textAlign: "center" }}>
          Modifique as configurações para tempo de descanso curto e descanso
          longo.
        </p>
      </Container>

      <Container>
        <form onSubmit={handleSaveSettings} action="" className="form">
          <div className="formRow">
            <DefaultInput
              id="workTime"
              labelText="Foco"
              ref={workTimeInput}
              defaultValue={state.config.workTime}
              type="number"
            />
          </div>

          <div className="formRow">
            <DefaultInput
              id="shortBreakTime"
              labelText="Descanso Curto"
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
              type="number"
            />
          </div>

          <div className="formRow">
            <DefaultInput
              id="longBreakTime"
              labelText="Descanso Longo"
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
              type="number"
            />
          </div>

          <div className="formRow">
            <DefaultButton
              icon={<SaveIcon />}
              aria-label="Salvar Configurações"
              title="Salvar Configurações"
            />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
}
