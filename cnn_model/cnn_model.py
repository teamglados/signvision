from __future__ import division, print_function, absolute_import

import tensorflow as tf

from utils import read_data
from sklearn.model_selection import train_test_split

data = read_data()
X_train = data["x"]
y_train = data["y"]

# , X_test, y_train, y_test = train_test_split(data["x"], data["y"], test_size=0.33, random_state=42)

# Training Parameters
learning_rate = 0.001
num_steps = 2000
batch_size = 128

num_classes = 2 # Only stop sign

# Create the neural network
def conv_net(features, reuse, n_classes, is_training):
    # Define a scope for reusing the variables
    with tf.variable_scope('ConvNet', reuse=reuse):
        x = tf.placeholder(tf.float32, shape=(None, 32, 32, 3))
        x = features['images']

        # Layer 1: Convolutional. Input = 32x32x3. Output = 28x28x32.
        conv1 = tf.layers.conv2d(x, filters=16, kernel_size=3, strides=2, activation=tf.nn.elu)

        # Layer 2: Convolutional. Output = 10x10x64.
        conv2 = tf.layers.conv2d(conv1, filters=32, kernel_size=3, strides=2, activation=tf.nn.elu)

        fc1 = tf.contrib.layers.flatten(conv2)

        # Fully connected layer (in tf contrib folder for now)
        out = tf.layers.dense(fc1, units=n_classes, name='out')
    return out


def model_fn(features, labels, mode):
    logits_train = conv_net(features, False, n_classes=num_classes, is_training=True)
    logits_test = conv_net(features, True, n_classes=num_classes, is_training=False)

    # Predictions
    pred_classes = tf.argmax(logits_test, axis=1)
    pred_probas = tf.nn.softmax(logits_test)

    # If prediction mode, early return
    if mode == tf.estimator.ModeKeys.PREDICT:
        return tf.estimator.EstimatorSpec(mode, predictions=pred_classes)

        # Define loss and optimizer
    loss_op = tf.reduce_mean(tf.nn.sparse_softmax_cross_entropy_with_logits(
        logits=logits_train, labels=tf.cast(labels, dtype=tf.int32)))
    optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate)
    train_op = optimizer.minimize(loss_op,
                                  global_step=tf.train.get_global_step())

    # Evaluate the accuracy of the model
    acc_op = tf.metrics.accuracy(labels=labels, predictions=pred_classes)

    # TF Estimators requires to return a EstimatorSpec, that specify
    # the different ops for training, evaluating, ...
    estim_specs = tf.estimator.EstimatorSpec(
        mode=mode,
        predictions=pred_classes,
        loss=loss_op,
        train_op=train_op,
        eval_metric_ops={'accuracy': acc_op})

    return estim_specs

# Build the Estimator
model = tf.estimator.Estimator(model_fn)

# Define the input function for training
input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': X_train}, y=y_train,
    batch_size=batch_size, num_epochs=None, shuffle=True)
# Train the Model
model.train(input_fn, steps=num_steps)

# Evaluate the Model
# Define the input function for evaluating
input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': X_train}, y=y_train,
    batch_size=batch_size, shuffle=False)
# Use the Estimator 'evaluate' method
e = model.evaluate(input_fn)

validation_data = read_data(path='validation/', true_label=None)
X_val = validation_data['x']
y_val = validation_data['y']

# Evaluate the Model
# Define the input function for evaluating
input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': X_val}, y=y_val,
    batch_size=batch_size, shuffle=False)
# Use the Estimator 'evaluate' method
e = model.evaluate(input_fn)
print("Stop signs", e)
# Validate model
# input_fn = tf.estimator.inputs.numpy_input_fn(x={'images': X_val}, num_epochs=1, shuffle=False)
# v = list(model.predict(input_fn))
# print("Predicted stop signs", v)
# print("Testing Accuracy:", e['accuracy'])

validation_data = read_data(path='validation_false/', true_label="asd")
X_val = validation_data['x']
y_val = validation_data['y']

input_fn = tf.estimator.inputs.numpy_input_fn(
    x={'images': X_val}, y=y_val,
    batch_size=batch_size, shuffle=False)
# Use the Estimator 'evaluate' method
e = model.evaluate(input_fn)
print("No stop signs", e)
import ipdb; ipdb.set_trace()

# Save model
feature_placeholders = {'images': tf.placeholder(tf.float32, shape=(None, 32, 32, 3), name='images')}
serving_input_fn = tf.estimator.export.build_raw_serving_input_receiver_fn(feature_placeholders)

model.export_savedmodel("./", serving_input_fn)