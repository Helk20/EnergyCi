import datetime
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential
import mysql.connector
from datetime import datetime, timedelta

import warnings
warnings.filterwarnings('ignore')

# Read the CSV file
df = pd.read_csv(r'C:/Users/baknz/Downloads/testset.csv')
data = pd.DataFrame(list(df[' _tempm']), index=df['datetime_utc'], columns=['temp'])
df = data[:365].dropna(axis=0)['temp'].values.reshape(-1, 1)

# Scale the data
scaler = MinMaxScaler(feature_range=(0, 1))
data_scaled = scaler.fit_transform(df)

# Prepare input and output sequences
steps = 20
inp, out = [], []
for i in range(len(data_scaled) - (steps)):
    inp.append(data_scaled[i:i+steps])
    out.append(data_scaled[i+steps])

inp, out = np.array(inp), np.array(out)

# Split data into training and testing sets
x_train, x_test = inp[:237, :, :], inp[237:, :, :]
y_train, y_test = out[:237], out[237:]

# Build the LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(steps, 1)))
model.add(LSTM(50, return_sequences=True))
model.add(LSTM(50))
model.add(Dense(1))
model.compile(loss='mean_squared_error', optimizer='adam')

# Train the model
model.fit(x_train, y_train, epochs=50, batch_size=32, verbose=1)

# Predictions for the next 30 days
temp_input = list(data_scaled[:20, 0])
lst_output = []

n_steps = 20
for i in range(30):
    if len(temp_input) > 20:
        x_input = np.array(temp_input[1:])
        x_input = x_input.reshape(1, -1, 1)
        yhat = model.predict(x_input, verbose=0)
        temp_input.extend(yhat[0].tolist())
        temp_input = temp_input[1:]
        lst_output.extend(yhat.tolist())
    else:
        x_input = np.array(temp_input)
        x_input = x_input.reshape(1, n_steps, 1)
        yhat = model.predict(x_input, verbose=0)
        temp_input.extend(yhat[0].tolist())
        lst_output.extend(yhat.tolist())

# Inverse transform the predictions to the original scale
predicted_temps = scaler.inverse_transform(np.array(lst_output).reshape(-1, 1))


# Print predicted temperatures in the console
print("Predicted Temperatures:")
for i, prediction in enumerate(predicted_temps):
    print(f"Day {i + 1}: {prediction[0]}")

# Connect to the database
db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="feoptimisationenergie"
)

# Create a database cursor
cursor = db_connection.cursor()

# Insert predictions into the "prediction" table
for i,prediction in enumerate(predicted_temps):
    day_number = i + 1
    # Calculate date for the prediction
    prediction_date = datetime.now() + timedelta(days=day_number)

    # Format the date for MySQL
    formatted_date = prediction_date.strftime("%Y-%m-%d")

    # Insert predictions into the "prediction" table with dates
    sql_insert = f"INSERT INTO prediction (consommation_predit, date_debut) VALUES ({prediction[0]}, '{formatted_date}')"
    cursor.execute(sql_insert)

# Commit the changes and close the connection
db_connection.commit()
cursor.close()
db_connection.close()
